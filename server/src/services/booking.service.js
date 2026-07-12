const { prisma } = require('../config/prisma');

// ============================================================================
// Booking Service — AssetFlow
// ============================================================================
// Conventions followed:
//   - All functions return { status, data } — controller unpacks via
//     res.status(response.status).json(response.data)
//   - No try/catch — error boundary lives in the controller
//   - Activity logs written inline with prisma.activityLog.create()
//   - Notifications written inline with prisma.notification.create()
//   - Prisma singleton imported from ../config/prisma
//   - No pagination (matches existing getAll pattern across all services)
//   - select used on user relations to exclude password / sensitive fields
// ============================================================================

// Valid status transitions. Terminal states map to empty arrays.
const ALLOWED_TRANSITIONS = {
    UPCOMING: ['ONGOING', 'CANCELLED'],
    ONGOING: ['COMPLETED', 'CANCELLED'],
    COMPLETED: [],
    CANCELLED: []
};

// Asset statuses that make an asset unavailable for new bookings.
const UNBOOKABLE_STATUSES = ['ALLOCATED', 'UNDER_MAINTENANCE', 'DISPOSED', 'LOST', 'RETIRED'];

// Minimum and maximum booking durations in milliseconds.
const MIN_DURATION_MS = 15 * 60 * 1000;         // 15 minutes
const MAX_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// Maximum number of simultaneous active bookings per user.
const MAX_ACTIVE_BOOKINGS = 5;

// ============================================================================
// GET /bookings
// ============================================================================
exports.getAll = async (query) => {
    const { assetId, userId, status, from, to, search } = query;

    const where = {};

    if (assetId) where.assetId = assetId;
    if (userId) where.userId = userId;
    if (status) where.status = status;

    if (from) where.startTime = { gte: new Date(from) };
    if (to) where.endTime = { lte: new Date(to) };

    // Search across asset name and asset tag (relation filter)
    if (search) {
        where.asset = {
            OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { assetTag: { contains: search, mode: 'insensitive' } }
            ]
        };
    }

    const bookings = await prisma.booking.findMany({
        where,
        include: {
            asset: {
                select: {
                    id: true,
                    name: true,
                    assetTag: true,
                    category: { select: { id: true, name: true } }
                }
            },
            user: { select: { id: true, name: true, email: true } }
        },
        orderBy: { startTime: 'asc' }
    });

    return {
        status: 200,
        data: { success: true, data: bookings }
    };
};

// ============================================================================
// GET /bookings/calendar
// ============================================================================
exports.getCalendar = async (query) => {
    const { assetId, from, to } = query;

    // Default window: current calendar month
    const now = new Date();
    const windowStart = from
        ? new Date(from)
        : new Date(now.getFullYear(), now.getMonth(), 1);
    const windowEnd = to
        ? new Date(to)
        : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const where = {
        status: { in: ['UPCOMING', 'ONGOING'] },
        startTime: { gte: windowStart },
        endTime: { lte: windowEnd }
    };

    if (assetId) where.assetId = assetId;

    const bookings = await prisma.booking.findMany({
        where,
        include: {
            asset: { select: { id: true, name: true, assetTag: true } },
            user: { select: { id: true, name: true } }
        },
        orderBy: { startTime: 'asc' }
    });

    return {
        status: 200,
        data: { success: true, data: bookings }
    };
};

// ============================================================================
// GET /bookings/:id
// ============================================================================
exports.getById = async (id) => {
    const booking = await prisma.booking.findUnique({
        where: { id },
        include: {
            asset: {
                select: {
                    id: true,
                    name: true,
                    assetTag: true,
                    location: true,
                    isBookable: true,
                    category: { select: { id: true, name: true } }
                }
            },
            user: { select: { id: true, name: true, email: true, departmentId: true } }
        }
    });

    if (!booking) {
        return {
            status: 404,
            data: { success: false, message: "Booking not found" }
        };
    }

    return {
        status: 200,
        data: { success: true, data: booking }
    };
};

// ============================================================================
// POST /bookings
// ============================================================================
exports.create = async (data, userId) => {
    const { assetId, startTime, endTime, purpose } = data;

    // --- Step 1: Temporal validation ---
    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    if (start <= now) {
        return {
            status: 400,
            data: { success: false, message: "startTime must be in the future" }
        };
    }

    if (end <= start) {
        return {
            status: 400,
            data: { success: false, message: "endTime must be after startTime" }
        };
    }

    const duration = end - start;

    if (duration < MIN_DURATION_MS) {
        return {
            status: 400,
            data: { success: false, message: "Booking duration must be at least 15 minutes" }
        };
    }

    if (duration > MAX_DURATION_MS) {
        return {
            status: 400,
            data: { success: false, message: "Booking duration cannot exceed 7 days" }
        };
    }

    // --- Step 2: Asset existence and bookability ---
    const asset = await prisma.asset.findUnique({ where: { id: assetId } });

    if (!asset) {
        return {
            status: 404,
            data: { success: false, message: "Asset not found" }
        };
    }

    if (!asset.isBookable) {
        return {
            status: 409,
            data: { success: false, message: "Asset is not bookable" }
        };
    }

    if (UNBOOKABLE_STATUSES.includes(asset.status)) {
        return {
            status: 409,
            data: { success: false, message: "Asset is not available for booking" }
        };
    }

    // --- Step 3: Overlap / conflict detection ---
    // Two intervals [A, B) and [C, D) overlap iff A < D AND C < B.
    // Translates to: existing.startTime < new.endTime AND existing.endTime > new.startTime.
    // Adjacent bookings (one ends exactly when another starts) are NOT a conflict.
    const conflict = await prisma.booking.findFirst({
        where: {
            assetId,
            status: { in: ['UPCOMING', 'ONGOING'] },
            startTime: { lt: end },
            endTime: { gt: start }
        }
    });

    if (conflict) {
        return {
            status: 409,
            data: { success: false, message: "Asset is already booked for this time slot" }
        };
    }

    // --- Step 4: Per-user active booking limit ---
    const activeCount = await prisma.booking.count({
        where: {
            userId,
            status: { in: ['UPCOMING', 'ONGOING'] }
        }
    });

    if (activeCount >= MAX_ACTIVE_BOOKINGS) {
        return {
            status: 429,
            data: {
                success: false,
                message: `Booking limit reached. You cannot have more than ${MAX_ACTIVE_BOOKINGS} active bookings.`
            }
        };
    }

    // --- Step 5: Create the booking ---
    const booking = await prisma.booking.create({
        data: {
            assetId,
            userId,
            startTime: start,
            endTime: end,
            purpose,
            status: 'UPCOMING'
        }
    });

    // --- Step 6: Activity log ---
    await prisma.activityLog.create({
        data: {
            userId,
            action: "BOOKING_CREATED",
            entityType: "BOOKING",
            entityId: booking.id,
            metadata: { assetId, startTime, endTime }
        }
    });

    return {
        status: 201,
        data: { success: true, message: "Booking created successfully", data: booking }
    };
};

// ============================================================================
// PATCH /bookings/:id/cancel
// ============================================================================
exports.cancel = async (id, requestorId, requestorRole) => {
    // Fetch booking with asset name for notification message
    const booking = await prisma.booking.findUnique({
        where: { id },
        include: {
            asset: { select: { name: true } }
        }
    });

    if (!booking) {
        return {
            status: 404,
            data: { success: false, message: "Booking not found" }
        };
    }

    // --- Ownership check (service-level — route passes all authenticated roles through) ---
    // ADMIN and ASSET_MANAGER may cancel any booking.
    // EMPLOYEE and DEPARTMENT_HEAD may only cancel their own.
    if (requestorRole === 'EMPLOYEE' || requestorRole === 'DEPARTMENT_HEAD') {
        if (booking.userId !== requestorId) {
            return {
                status: 403,
                data: { success: false, message: "You do not have permission to cancel this booking" }
            };
        }
    }

    // --- Status guard ---
    if (booking.status === 'ONGOING') {
        return {
            status: 409,
            data: { success: false, message: "Cannot cancel an ongoing booking. Contact an admin." }
        };
    }

    if (booking.status === 'COMPLETED' || booking.status === 'CANCELLED') {
        return {
            status: 409,
            data: { success: false, message: `Booking is already ${booking.status}` }
        };
    }

    // --- Cancel ---
    await prisma.booking.update({
        where: { id },
        data: { status: 'CANCELLED' }
    });

    // --- Activity log ---
    await prisma.activityLog.create({
        data: {
            userId: requestorId,
            action: "BOOKING_CANCELLED",
            entityType: "BOOKING",
            entityId: id
        }
    });

    // --- Notify booking owner only when someone else (admin/manager) cancels ---
    if (requestorId !== booking.userId) {
        await prisma.notification.create({
            data: {
                userId: booking.userId,
                title: "Booking Cancelled",
                message: `Your booking for ${booking.asset.name} has been cancelled.`
            }
        });
    }

    return {
        status: 200,
        data: { success: true, message: "Booking cancelled successfully" }
    };
};

// ============================================================================
// PATCH /bookings/:id/status
// ============================================================================
exports.updateStatus = async (id, status, actorId) => {
    // Fetch with asset for notification message
    const booking = await prisma.booking.findUnique({
        where: { id },
        include: {
            asset: { select: { name: true } }
        }
    });

    if (!booking) {
        return {
            status: 404,
            data: { success: false, message: "Booking not found" }
        };
    }

    // --- State machine: validate the requested transition ---
    const allowed = ALLOWED_TRANSITIONS[booking.status];
    if (!allowed.includes(status)) {
        return {
            status: 409,
            data: {
                success: false,
                message: `Invalid status transition from ${booking.status} to ${status}`
            }
        };
    }

    // --- Update ---
    const updated = await prisma.booking.update({
        where: { id },
        data: { status }
    });

    // --- Activity log (includes old → new for audit trail) ---
    await prisma.activityLog.create({
        data: {
            userId: actorId,
            action: "BOOKING_STATUS_UPDATED",
            entityType: "BOOKING",
            entityId: id,
            metadata: { from: booking.status, to: status }
        }
    });

    // --- Notify owner on completion ---
    if (status === 'COMPLETED') {
        await prisma.notification.create({
            data: {
                userId: booking.userId,
                title: "Booking Completed",
                message: `Your booking for ${booking.asset.name} has been marked as completed.`
            }
        });
    }

    return {
        status: 200,
        data: { success: true, message: "Booking status updated successfully", data: updated }
    };
};