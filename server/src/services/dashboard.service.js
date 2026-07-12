const { prisma } = require('../config/prisma');

// ============================================================================
// Dashboard Service — AssetFlow
// ============================================================================

exports.getDashboard = async (user) => {
    // ------------------------------------------------------------------------
    // EMPLOYEE DASHBOARD
    // ------------------------------------------------------------------------
    if (user.role === 'EMPLOYEE') {
        const userId = user.id;

        const [
            activeAllocationsCount,
            activeBookingsCount,
            pendingMaintenanceCount,
            myAllocations,
            myBookings,
            myMaintenance
        ] = await Promise.all([
            // Counts
            prisma.allocation.count({ where: { userId, returnedAt: null } }),
            prisma.booking.count({ where: { userId, status: { in: ['UPCOMING', 'ONGOING'] } } }),
            prisma.maintenanceRequest.count({ where: { requesterId: userId, status: 'PENDING' } }),
            
            // Lists
            prisma.allocation.findMany({
                where: { userId, returnedAt: null },
                take: 5,
                orderBy: { allocatedAt: 'asc' }, // Oldest allocations first (upcoming returns)
                include: { asset: { select: { name: true, assetTag: true } } }
            }),
            prisma.booking.findMany({
                where: { userId, status: { in: ['UPCOMING', 'ONGOING'] } },
                take: 5,
                orderBy: { startTime: 'asc' },
                include: { asset: { select: { name: true, assetTag: true } } }
            }),
            prisma.maintenanceRequest.findMany({
                where: { requesterId: userId },
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { asset: { select: { name: true, assetTag: true } } }
            })
        ]);

        return {
            status: 200,
            data: {
                success: true,
                data: {
                    summary: {
                        activeAllocations: activeAllocationsCount,
                        activeBookings: activeBookingsCount,
                        pendingMaintenance: pendingMaintenanceCount
                    },
                    myAllocations,
                    myBookings,
                    myMaintenance
                }
            }
        };
    }

    // ------------------------------------------------------------------------
    // ADMIN / ASSET_MANAGER / DEPARTMENT_HEAD DASHBOARD
    // ------------------------------------------------------------------------

    // Role-based where clauses
    const isDeptHead = user.role === 'DEPARTMENT_HEAD';
    const deptId = user.departmentId;

    const assetWhere = isDeptHead ? { departmentId: deptId } : {};
    const allocationWhere = isDeptHead ? { user: { departmentId: deptId } } : {};
    const bookingWhere = isDeptHead ? { user: { departmentId: deptId } } : {};
    const maintenanceWhere = isDeptHead ? { requester: { departmentId: deptId } } : {};
    const activityWhere = isDeptHead ? { user: { departmentId: deptId } } : {};

    // Helper for "Today" queries
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Prepare monthly trend promises (last 6 months)
    const monthlyTrendPromises = Array.from({ length: 6 }).map((_, i) => {
        const d = new Date();
        d.setDate(1); // Prevents rollover bugs on 31st of the month
        d.setMonth(d.getMonth() - i);
        const year = d.getFullYear();
        const month = d.getMonth();
        
        const startOfMonth = new Date(year, month, 1);
        const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);
        
        return prisma.booking.count({
            where: {
                ...bookingWhere,
                createdAt: { gte: startOfMonth, lte: endOfMonth }
            }
        }).then(count => ({
            month: `${year}-${String(month + 1).padStart(2, '0')}`,
            count
        }));
    });

    // Execute all queries concurrently
    const [
        // Asset Summary
        totalAssets,
        availableAssets,
        allocatedAssets,
        reservedAssets,
        underMaintenanceAssets,
        disposedAssets,
        totalValueResult,
        statusDistributionRaw,
        categoriesData,
        departmentsData,

        // Cross-Module Summary
        activeBookings,
        activeAllocations,
        pendingMaintenance,

        // Booking Analytics
        upcomingBookings,
        ongoingBookings,
        completedBookingsToday,

        // Maintenance Analytics
        inProgressMaintenance,
        completedMaintenanceToday,

        // Recent Data
        recentBookings,
        recentActivity,
        upcomingReturns,

        // Monthly Trend (Array of 6 promises)
        ...monthlyTrendResults
    ] = await Promise.all([
        // Asset Summary
        prisma.asset.count({ where: assetWhere }),
        prisma.asset.count({ where: { ...assetWhere, status: 'AVAILABLE' } }),
        prisma.asset.count({ where: { ...assetWhere, status: 'ALLOCATED' } }),
        prisma.asset.count({ where: { ...assetWhere, status: 'RESERVED' } }),
        prisma.asset.count({ where: { ...assetWhere, status: 'UNDER_MAINTENANCE' } }),
        prisma.asset.count({ where: { ...assetWhere, status: 'DISPOSED' } }),
        prisma.asset.aggregate({ _sum: { purchaseCost: true }, where: assetWhere }),
        
        // Status Distribution via groupBy
        prisma.asset.groupBy({ by: ['status'], _count: { id: true }, where: assetWhere }),
        
        // Category Distribution via relation count
        prisma.category.findMany({
            select: { id: true, name: true, _count: { select: { assets: { where: assetWhere } } } }
        }),
        
        // Department Distribution via relation count
        prisma.department.findMany({
            where: isDeptHead ? { id: deptId } : {},
            select: { id: true, name: true, _count: { select: { assets: { where: assetWhere } } } }
        }),

        // Cross-Module Summary
        prisma.booking.count({ where: { ...bookingWhere, status: { in: ['UPCOMING', 'ONGOING'] } } }),
        prisma.allocation.count({ where: { ...allocationWhere, returnedAt: null } }),
        prisma.maintenanceRequest.count({ where: { ...maintenanceWhere, status: 'PENDING' } }),

        // Booking Analytics
        prisma.booking.count({ where: { ...bookingWhere, status: 'UPCOMING' } }),
        prisma.booking.count({ where: { ...bookingWhere, status: 'ONGOING' } }),
        prisma.booking.count({ where: { ...bookingWhere, status: 'COMPLETED', updatedAt: { gte: startOfToday } } }),

        // Maintenance Analytics
        prisma.maintenanceRequest.count({ where: { ...maintenanceWhere, status: 'IN_PROGRESS' } }),
        prisma.maintenanceRequest.count({ where: { ...maintenanceWhere, status: 'RESOLVED', resolvedAt: { gte: startOfToday } } }),

        // Recent Data
        prisma.booking.findMany({
            where: bookingWhere,
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { asset: { select: { name: true } }, user: { select: { name: true } } }
        }),
        prisma.activityLog.findMany({
            where: activityWhere,
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true } } }
        }),
        prisma.allocation.findMany({
            where: { ...allocationWhere, returnedAt: null },
            take: 5,
            orderBy: { allocatedAt: 'asc' }, // Oldest active allocations first
            include: { asset: { select: { name: true } }, user: { select: { name: true } } }
        }),

        // Monthly Trend
        ...monthlyTrendPromises
    ]);

    // Format distributions
    const statusDistribution = statusDistributionRaw.map(s => ({
        status: s.status,
        count: s._count.id
    }));
    
    // Filter out categories and departments with 0 assets for this scope
    const categoryDistribution = categoriesData
        .filter(c => c._count.assets > 0)
        .map(c => ({ categoryId: c.id, name: c.name, count: c._count.assets }));

    const departmentDistribution = departmentsData
        .filter(d => d._count.assets > 0)
        .map(d => ({ departmentId: d.id, name: d.name, count: d._count.assets }));

    // Monthly trend sorting (oldest month first)
    const monthlyTrend = monthlyTrendResults.sort((a, b) => a.month.localeCompare(b.month));

    const totalAssetValue = totalValueResult._sum.purchaseCost ? Number(totalValueResult._sum.purchaseCost) : 0;

    return {
        status: 200,
        data: {
            success: true,
            data: {
                summary: {
                    totalAssets,
                    availableAssets,
                    allocatedAssets,
                    reservedAssets,
                    underMaintenance: underMaintenanceAssets,
                    disposedAssets,
                    activeBookings,
                    activeAllocations,
                    pendingMaintenance
                },
                assetAnalytics: {
                    statusDistribution,
                    categoryDistribution,
                    departmentDistribution,
                    totalAssetValue
                },
                bookingAnalytics: {
                    upcomingBookings,
                    ongoingBookings,
                    completedToday: completedBookingsToday,
                    monthlyTrend
                },
                maintenance: {
                    pending: pendingMaintenance,
                    inProgress: inProgressMaintenance,
                    completedToday: completedMaintenanceToday
                },
                recentData: {
                    recentBookings,
                    recentActivity,
                    upcomingReturns
                }
            }
        }
    };
};