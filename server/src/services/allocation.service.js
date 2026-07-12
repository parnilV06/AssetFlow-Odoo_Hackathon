const { prisma } = require('../config/prisma');

exports.getAll = async (query) => {
    const { employee, asset, status, search } = query;
    const where = {
        returnedAt: null // Only current allocations by default unless specified otherwise? The prompt says "Return Current allocations."
    };
    
    if (employee) where.userId = employee;
    if (asset) where.assetId = asset;
    
    // If they explicitly want all statuses, we can support it, but prompt says "Return Current allocations."
    if (status === 'RETURNED') where.returnedAt = { not: null };
    else if (status === 'ACTIVE') where.returnedAt = null;

    if (search) {
        where.OR = [
            { asset: { assetTag: { contains: search, mode: 'insensitive' } } },
            { asset: { serialNumber: { contains: search, mode: 'insensitive' } } },
            { user: { name: { contains: search, mode: 'insensitive' } } }
        ];
    }

    const allocations = await prisma.allocation.findMany({
        where,
        include: {
            asset: { select: { id: true, name: true, assetTag: true, serialNumber: true } },
            user: { select: { id: true, name: true, email: true } }
        },
        orderBy: { allocatedAt: 'desc' }
    });

    return {
        status: 200,
        data: { success: true, data: allocations }
    };
};

exports.getById = async (id) => {
    const allocation = await prisma.allocation.findUnique({
        where: { id },
        include: {
            asset: true,
            user: {
                include: { department: true }
            }
        }
    });

    if (!allocation) {
        return {
            status: 404,
            data: { success: false, message: "Allocation not found" }
        };
    }

    const formatted = {
        id: allocation.id,
        allocationDate: allocation.allocatedAt,
        expectedReturn: allocation.expectedReturn,
        returnedAt: allocation.returnedAt,
        conditionNotes: allocation.notes,
        asset: allocation.asset,
        employee: {
            id: allocation.user.id,
            name: allocation.user.name,
            email: allocation.user.email,
            status: allocation.user.status
        },
        department: allocation.user.department
    };

    return {
        status: 200,
        data: { success: true, data: formatted }
    };
};

exports.allocate = async (data, adminId) => {
    const { assetId, employeeId, expectedReturn, conditionNotes } = data;

    return await prisma.$transaction(async (tx) => {
        const asset = await tx.asset.findUnique({ where: { id: assetId } });
        if (!asset) {
            return { status: 404, data: { success: false, message: "Asset not found" } };
        }

        if (asset.status === 'ALLOCATED') return { status: 409, data: { success: false, message: "Asset is already allocated" } };
        if (asset.status === 'UNDER_MAINTENANCE') return { status: 409, data: { success: false, message: "Asset is under maintenance" } };
        if (asset.status === 'DISPOSED') return { status: 409, data: { success: false, message: "Asset is disposed" } };
        if (asset.status !== 'AVAILABLE') return { status: 409, data: { success: false, message: `Asset status is ${asset.status}` } };

        const employee = await tx.user.findUnique({
            where: { id: employeeId },
            include: { department: true }
        });
        
        if (!employee) return { status: 404, data: { success: false, message: "Employee not found" } };
        if (employee.status !== 'ACTIVE') return { status: 409, data: { success: false, message: "Employee is not active" } };
        if (!employee.department || employee.department.status !== 'ACTIVE') {
            return { status: 409, data: { success: false, message: "Employee's department is not active" } };
        }

        const allocation = await tx.allocation.create({
            data: {
                assetId,
                userId: employeeId,
                expectedReturn: expectedReturn ? new Date(expectedReturn) : null,
                notes: conditionNotes,
                allocatedBy: adminId
            }
        });

        await tx.asset.update({
            where: { id: assetId },
            data: { status: 'ALLOCATED' }
        });

        await tx.notification.create({
            data: {
                userId: employeeId,
                title: "Asset Assigned",
                message: `You have been allocated asset: ${asset.name} (${asset.assetTag}).`
            }
        });

        await tx.activityLog.create({
            data: {
                userId: adminId,
                action: "ASSET_ALLOCATED",
                entityType: "ALLOCATION",
                entityId: allocation.id,
                metadata: { assetId, employeeId }
            }
        });

        return {
            status: 201,
            data: { success: true, message: "Asset allocated successfully", data: allocation }
        };
    });
};

exports.returnAsset = async (data, adminId) => {
    const { assetId, conditionNotes } = data;

    return await prisma.$transaction(async (tx) => {
        const allocation = await tx.allocation.findFirst({
            where: { assetId, returnedAt: null }
        });

        if (!allocation) {
            return { status: 409, data: { success: false, message: "Asset does not have an active allocation." } };
        }

        const updatedAllocation = await tx.allocation.update({
            where: { id: allocation.id },
            data: {
                returnedAt: new Date(),
                notes: conditionNotes ? `${allocation.notes ? allocation.notes + ' | ' : ''}Return Notes: ${conditionNotes}` : allocation.notes
            }
        });

        const asset = await tx.asset.update({
            where: { id: assetId },
            data: { status: 'AVAILABLE' }
        });

        await tx.notification.create({
            data: {
                userId: allocation.userId,
                title: "Asset Returned",
                message: `Your allocation for asset ${asset.name} (${asset.assetTag}) has been closed.`
            }
        });

        await tx.activityLog.create({
            data: {
                userId: adminId,
                action: "ASSET_RETURNED",
                entityType: "ALLOCATION",
                entityId: allocation.id,
                metadata: { assetId, employeeId: allocation.userId }
            }
        });

        return {
            status: 200,
            data: { success: true, message: "Asset returned successfully", data: updatedAllocation }
        };
    });
};

exports.transfer = async (data, adminId) => {
    const { assetId, newEmployeeId, expectedReturn } = data;

    return await prisma.$transaction(async (tx) => {
        const currentAllocation = await tx.allocation.findFirst({
            where: { assetId, returnedAt: null }
        });

        if (!currentAllocation) {
            return { status: 409, data: { success: false, message: "Asset is not currently allocated." } };
        }

        if (currentAllocation.userId === newEmployeeId) {
            return { status: 409, data: { success: false, message: "Cannot transfer asset to the same employee." } };
        }

        const newEmployee = await tx.user.findUnique({
            where: { id: newEmployeeId },
            include: { department: true }
        });

        if (!newEmployee) return { status: 404, data: { success: false, message: "New employee not found" } };
        if (newEmployee.status !== 'ACTIVE') return { status: 409, data: { success: false, message: "New employee is not active" } };
        if (!newEmployee.department || newEmployee.department.status !== 'ACTIVE') {
            return { status: 409, data: { success: false, message: "New employee's department is not active" } };
        }

        // Close old allocation
        await tx.allocation.update({
            where: { id: currentAllocation.id },
            data: { returnedAt: new Date(), notes: `${currentAllocation.notes ? currentAllocation.notes + ' | ' : ''}Closed due to transfer.` }
        });

        // Create new allocation
        const newAllocation = await tx.allocation.create({
            data: {
                assetId,
                userId: newEmployeeId,
                expectedReturn: expectedReturn ? new Date(expectedReturn) : null,
                allocatedBy: adminId
            }
        });

        const asset = await tx.asset.findUnique({ where: { id: assetId } });

        await tx.notification.create({
            data: {
                userId: currentAllocation.userId,
                title: "Asset Transferred",
                message: `Asset ${asset.name} (${asset.assetTag}) has been transferred from your account.`
            }
        });

        await tx.notification.create({
            data: {
                userId: newEmployeeId,
                title: "Asset Assigned",
                message: `You have been allocated asset: ${asset.name} (${asset.assetTag}) via transfer.`
            }
        });

        await tx.activityLog.create({
            data: {
                userId: adminId,
                action: "ASSET_TRANSFERRED",
                entityType: "ALLOCATION",
                entityId: newAllocation.id,
                metadata: { assetId, from: currentAllocation.userId, to: newEmployeeId }
            }
        });

        return {
            status: 201, // 201 created for new allocation
            data: { success: true, message: "Asset transferred successfully", data: newAllocation }
        };
    });
};

exports.getAssetHistory = async (assetId) => {
    const allocations = await prisma.allocation.findMany({
        where: { assetId },
        orderBy: { allocatedAt: 'desc' },
        include: {
            user: { select: { id: true, name: true, email: true } },
            asset: { select: { id: true, name: true, assetTag: true } }
        }
    });

    return {
        status: 200,
        data: { success: true, data: allocations }
    };
};