const { prisma } = require('../config/prisma');

const PRIORITY_MAP = {
    'CRITICAL': 1,
    'HIGH': 2,
    'MEDIUM': 3,
    'LOW': 4
};

const PRIORITY_REVERSE_MAP = {
    1: 'CRITICAL',
    2: 'HIGH',
    3: 'MEDIUM',
    4: 'LOW'
};

const formatRequest = (req) => {
    if (!req) return req;
    return {
        ...req,
        priority: PRIORITY_REVERSE_MAP[req.priority] || 'MEDIUM'
    };
};

exports.getAll = async (query) => {
    const { status, priority, asset, search } = query;
    const where = {};
    
    if (status) where.status = status;
    if (priority && PRIORITY_MAP[priority]) where.priority = PRIORITY_MAP[priority];
    if (asset) where.assetId = asset;

    if (search) {
        where.OR = [
            { asset: { name: { contains: search, mode: 'insensitive' } } },
            { asset: { assetTag: { contains: search, mode: 'insensitive' } } },
            { description: { contains: search, mode: 'insensitive' } }
        ];
    }

    const requests = await prisma.maintenanceRequest.findMany({
        where,
        include: {
            asset: { select: { id: true, name: true, assetTag: true } },
            requester: { select: { id: true, name: true } },
            technician: { select: { id: true, name: true } }
        },
        orderBy: { createdAt: 'desc' }
    });

    return {
        status: 200,
        data: { success: true, data: requests.map(formatRequest) }
    };
};

exports.getById = async (id) => {
    const request = await prisma.maintenanceRequest.findUnique({
        where: { id },
        include: {
            asset: true,
            requester: { select: { id: true, name: true, email: true } },
            technician: { select: { id: true, name: true, email: true } }
        }
    });

    if (!request) {
        return {
            status: 404,
            data: { success: false, message: "Maintenance request not found" }
        };
    }

    return {
        status: 200,
        data: { success: true, data: formatRequest(request) }
    };
};

exports.create = async (data, userId) => {
    const { assetId, description, priority } = data;

    return await prisma.$transaction(async (tx) => {
        const asset = await tx.asset.findUnique({ where: { id: assetId } });
        if (!asset) return { status: 404, data: { success: false, message: "Asset not found" } };

        if (asset.status === 'DISPOSED') {
            return { status: 409, data: { success: false, message: "Cannot raise maintenance on a disposed asset." } };
        }

        const activeRequest = await tx.maintenanceRequest.findFirst({
            where: {
                assetId,
                status: { notIn: ['RESOLVED', 'REJECTED'] }
            }
        });

        if (activeRequest) {
            return { status: 409, data: { success: false, message: "Asset already has an active maintenance request." } };
        }

        const title = description.length > 50 ? description.substring(0, 47) + '...' : description;

        const request = await tx.maintenanceRequest.create({
            data: {
                assetId,
                requesterId: userId,
                title,
                description,
                priority: PRIORITY_MAP[priority],
                status: 'PENDING'
            }
        });

        await tx.notification.create({
            data: {
                userId,
                title: "Maintenance Request Raised",
                message: `You raised a maintenance request for ${asset.name}.`
            }
        });

        await tx.activityLog.create({
            data: {
                userId,
                action: "MAINTENANCE_REQUESTED",
                entityType: "MAINTENANCE",
                entityId: request.id
            }
        });

        return {
            status: 201,
            data: { success: true, message: "Maintenance request raised successfully", data: formatRequest(request) }
        };
    });
};

exports.update = async (id, data, adminId) => {
    const { status, technicianId } = data;

    return await prisma.$transaction(async (tx) => {
        const request = await tx.maintenanceRequest.findUnique({
            where: { id },
            include: { asset: true }
        });

        if (!request) {
            return { status: 404, data: { success: false, message: "Maintenance request not found" } };
        }

        const currentStatus = request.status;

        // State machine validation
        if (status === 'APPROVED' && currentStatus !== 'PENDING') {
            return { status: 409, data: { success: false, message: "APPROVED is only valid from PENDING." } };
        }
        if (status === 'REJECTED' && currentStatus !== 'PENDING') {
            return { status: 409, data: { success: false, message: "REJECTED is only valid from PENDING." } };
        }
        if (status === 'ASSIGNED') {
            if (currentStatus !== 'APPROVED') return { status: 409, data: { success: false, message: "ASSIGNED is only valid from APPROVED." } };
            if (!technicianId) return { status: 400, data: { success: false, message: "Technician ID is required for assignment." } };
            
            const tech = await tx.user.findUnique({ where: { id: technicianId } });
            if (!tech || tech.status !== 'ACTIVE') {
                return { status: 409, data: { success: false, message: "Technician must exist and be ACTIVE." } };
            }
        }
        if (status === 'IN_PROGRESS' && currentStatus !== 'ASSIGNED') {
            return { status: 409, data: { success: false, message: "IN_PROGRESS is only valid from ASSIGNED." } };
        }
        if (status === 'RESOLVED' && currentStatus !== 'IN_PROGRESS') {
            return { status: 409, data: { success: false, message: "RESOLVED is only valid from IN_PROGRESS." } };
        }

        const updateData = { status };
        if (status === 'ASSIGNED') updateData.technicianId = technicianId;
        if (status === 'RESOLVED') updateData.resolvedAt = new Date();

        const updatedRequest = await tx.maintenanceRequest.update({
            where: { id },
            data: updateData
        });

        if (status === 'IN_PROGRESS') {
            await tx.asset.update({ where: { id: request.assetId }, data: { status: 'UNDER_MAINTENANCE' } });
        } else if (status === 'RESOLVED') {
            await tx.asset.update({ where: { id: request.assetId }, data: { status: 'AVAILABLE' } });
        }

        // Action map for notifications and logs
        const ACTION_MAP = {
            'APPROVED': { title: "Maintenance Approved", action: "MAINTENANCE_APPROVED" },
            'REJECTED': { title: "Maintenance Rejected", action: "MAINTENANCE_REJECTED" },
            'ASSIGNED': { title: "Technician Assigned", action: "MAINTENANCE_ASSIGNED" },
            'IN_PROGRESS': { title: "Maintenance Started", action: "MAINTENANCE_STARTED" },
            'RESOLVED': { title: "Maintenance Completed", action: "MAINTENANCE_RESOLVED" }
        };

        const event = ACTION_MAP[status];

        // Notify requester
        await tx.notification.create({
            data: {
                userId: request.requesterId,
                title: event.title,
                message: `Update on ${request.asset.name}: ${event.title}`
            }
        });

        // Notify technician if just assigned
        if (status === 'ASSIGNED') {
            await tx.notification.create({
                data: {
                    userId: technicianId,
                    title: "New Assignment",
                    message: `You have been assigned to maintain ${request.asset.name}.`
                }
            });
        }

        await tx.activityLog.create({
            data: {
                userId: adminId,
                action: event.action,
                entityType: "MAINTENANCE",
                entityId: request.id
            }
        });

        return {
            status: 200,
            data: { success: true, message: `Maintenance request marked as ${status}`, data: formatRequest(updatedRequest) }
        };
    });
};

exports.getAssetHistory = async (assetId) => {
    const history = await prisma.maintenanceRequest.findMany({
        where: { assetId },
        orderBy: { createdAt: 'desc' },
        include: {
            requester: { select: { id: true, name: true } },
            technician: { select: { id: true, name: true } }
        }
    });

    return {
        status: 200,
        data: { success: true, data: history.map(formatRequest) }
    };
};