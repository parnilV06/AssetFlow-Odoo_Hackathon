const { prisma } = require('../config/prisma');

// Helper to map Prisma entity to expected Asset JSON format
const formatAsset = (asset) => {
    if (!asset) return asset;
    const formatted = { ...asset };
    formatted.acquisitionDate = asset.purchaseDate;
    formatted.acquisitionCost = asset.purchaseCost;
    delete formatted.purchaseDate;
    delete formatted.purchaseCost;
    return formatted;
};

exports.getAll = async (query) => {
    const { search, status, category, department, condition, bookable } = query;
    const where = {};
    
    if (status) where.status = status;
    if (category) where.categoryId = category;
    if (department) where.departmentId = department;
    if (condition) where.condition = condition;
    if (bookable !== undefined) where.isBookable = bookable === 'true';

    if (search) {
        where.OR = [
            { assetTag: { contains: search, mode: 'insensitive' } },
            { serialNumber: { contains: search, mode: 'insensitive' } },
            { name: { contains: search, mode: 'insensitive' } },
            { location: { contains: search, mode: 'insensitive' } }
        ];
    }

    const assets = await prisma.asset.findMany({
        where,
        select: {
            id: true,
            assetTag: true,
            name: true,
            serialNumber: true,
            categoryId: true,
            departmentId: true,
            condition: true,
            location: true,
            purchaseDate: true,
            purchaseCost: true,
            status: true,
            isBookable: true,
            imageUrl: true,
            createdAt: true,
            updatedAt: true,
            category: { select: { id: true, name: true } },
            department: { select: { id: true, name: true } }
        }
    });

    return {
        status: 200,
        data: { success: true, data: assets.map(formatAsset) }
    };
};

exports.getById = async (id) => {
    const asset = await prisma.asset.findUnique({
        where: { id },
        include: {
            category: true,
            department: true,
            allocations: {
                where: { returnedAt: null },
                include: { user: { select: { id: true, name: true, email: true } } }
            },
            maintenanceRequests: {
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!asset) {
        return {
            status: 404,
            data: { success: false, message: "Asset not found" }
        };
    }

    const currentHolder = asset.allocations.length > 0 ? asset.allocations[0].user : null;
    const formatted = formatAsset(asset);
    
    const result = {
        ...formatted,
        currentHolder,
        allocationHistory: formatted.allocations, // Just the active ones per the include? Actually, prompt says "Allocation History". 
        // Wait, for full history I should fetch all allocations. Let's do that below.
    };

    // To get FULL history for the GET /:id response:
    const allAllocations = await prisma.allocation.findMany({
        where: { assetId: id },
        orderBy: { allocatedAt: 'desc' },
        include: { user: { select: { id: true, name: true } } }
    });
    
    result.allocationHistory = allAllocations;
    result.maintenanceHistory = asset.maintenanceRequests;
    delete result.allocations;
    delete result.maintenanceRequests;

    return {
        status: 200,
        data: { success: true, data: result }
    };
};

exports.getHistory = async (id) => {
    const asset = await prisma.asset.findUnique({
        where: { id },
        select: { id: true }
    });

    if (!asset) {
        return {
            status: 404,
            data: { success: false, message: "Asset not found" }
        };
    }

    const allocationHistory = await prisma.allocation.findMany({
        where: { assetId: id },
        orderBy: { allocatedAt: 'desc' },
        include: { user: { select: { id: true, name: true, email: true } } }
    });

    const maintenanceHistory = await prisma.maintenanceRequest.findMany({
        where: { assetId: id },
        orderBy: { createdAt: 'desc' }
    });

    return {
        status: 200,
        data: {
            success: true,
            data: {
                allocationHistory,
                maintenanceHistory
            }
        }
    };
};

exports.getQr = async (id) => {
    const asset = await prisma.asset.findUnique({
        where: { id },
        select: { assetTag: true }
    });

    if (!asset) {
        return {
            status: 404,
            data: { success: false, message: "Asset not found" }
        };
    }

    return {
        status: 200,
        data: {
            success: true,
            data: {
                assetTag: asset.assetTag,
                url: `/assets/${asset.assetTag}`
            }
        }
    };
};

// Auto-generate next asset tag (AF-0001, AF-0002, etc.)
const generateNextAssetTag = async () => {
    const lastAsset = await prisma.asset.findFirst({
        orderBy: { assetTag: 'desc' }
    });

    if (!lastAsset || !lastAsset.assetTag.startsWith('AF-')) {
        return 'AF-0001';
    }

    const lastNumber = parseInt(lastAsset.assetTag.split('-')[1], 10);
    if (isNaN(lastNumber)) return 'AF-0001';
    
    const nextNumber = lastNumber + 1;
    return `AF-${nextNumber.toString().padStart(4, '0')}`;
};

exports.create = async (data, userId) => {
    const { name, categoryId, departmentId, serialNumber, condition, location, acquisitionDate, acquisitionCost, isBookable, imageUrl } = data;

    // Check unique serial number
    const existingSerial = await prisma.asset.findFirst({
        where: { serialNumber: { equals: serialNumber, mode: 'insensitive' } }
    });

    if (existingSerial) {
        return {
            status: 409,
            data: { success: false, message: "Serial number must be unique" }
        };
    }

    // Verify category and department
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category || category.status !== 'ACTIVE') {
        return {
            status: 400,
            data: { success: false, message: "Category must exist and be ACTIVE" }
        };
    }

    const department = await prisma.department.findUnique({ where: { id: departmentId } });
    if (!department || department.status !== 'ACTIVE') {
        return {
            status: 400,
            data: { success: false, message: "Department must exist and be ACTIVE" }
        };
    }

    const assetTag = await generateNextAssetTag();

    const asset = await prisma.asset.create({
        data: {
            name,
            assetTag,
            serialNumber,
            categoryId,
            departmentId,
            condition,
            location,
            purchaseDate: new Date(acquisitionDate),
            purchaseCost: acquisitionCost,
            isBookable,
            imageUrl,
            status: 'AVAILABLE'
        }
    });

    await prisma.activityLog.create({
        data: {
            userId,
            action: "ASSET_CREATED",
            entityType: "ASSET",
            entityId: asset.id
        }
    });

    return {
        status: 201,
        data: { success: true, message: "Asset registered successfully", data: formatAsset(asset) }
    };
};

exports.update = async (id, data, userId) => {
    const asset = await prisma.asset.findUnique({ where: { id } });
    if (!asset) {
        return {
            status: 404,
            data: { success: false, message: "Asset not found" }
        };
    }

    if (asset.status === 'DISPOSED') {
        return {
            status: 409,
            data: { success: false, message: "Disposed assets cannot be modified." }
        };
    }

    const { name, categoryId, departmentId, condition, location, acquisitionDate, acquisitionCost, isBookable, imageUrl } = data;

    if (categoryId && categoryId !== asset.categoryId) {
        const category = await prisma.category.findUnique({ where: { id: categoryId } });
        if (!category || category.status !== 'ACTIVE') {
            return {
                status: 400,
                data: { success: false, message: "Category must exist and be ACTIVE" }
            };
        }
    }

    if (departmentId && departmentId !== asset.departmentId) {
        const department = await prisma.department.findUnique({ where: { id: departmentId } });
        if (!department || department.status !== 'ACTIVE') {
            return {
                status: 400,
                data: { success: false, message: "Department must exist and be ACTIVE" }
            };
        }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (categoryId) updateData.categoryId = categoryId;
    if (departmentId) updateData.departmentId = departmentId;
    if (condition) updateData.condition = condition;
    if (location) updateData.location = location;
    if (acquisitionDate) updateData.purchaseDate = new Date(acquisitionDate);
    if (acquisitionCost !== undefined) updateData.purchaseCost = acquisitionCost;
    if (isBookable !== undefined) updateData.isBookable = isBookable;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

    const updated = await prisma.asset.update({
        where: { id },
        data: updateData
    });

    await prisma.activityLog.create({
        data: {
            userId,
            action: "ASSET_UPDATED",
            entityType: "ASSET",
            entityId: asset.id
        }
    });

    return {
        status: 200,
        data: { success: true, message: "Asset updated successfully", data: formatAsset(updated) }
    };
};

exports.deleteAsset = async (id, userId) => {
    const asset = await prisma.asset.findUnique({ where: { id } });
    if (!asset) {
        return {
            status: 404,
            data: { success: false, message: "Asset not found" }
        };
    }

    if (asset.status === 'ALLOCATED') {
        return {
            status: 409,
            data: { success: false, message: "Cannot dispose asset because it is currently ALLOCATED." }
        };
    }

    if (asset.status === 'UNDER_MAINTENANCE') {
        return {
            status: 409,
            data: { success: false, message: "Cannot dispose asset because it is UNDER_MAINTENANCE." }
        };
    }

    const activeBookings = await prisma.booking.count({
        where: { assetId: id, status: { in: ['UPCOMING', 'ONGOING'] } }
    });

    if (activeBookings > 0) {
        return {
            status: 409,
            data: { success: false, message: "Cannot dispose asset because it has active bookings." }
        };
    }

    await prisma.asset.update({
        where: { id },
        data: { status: 'DISPOSED' }
    });

    await prisma.activityLog.create({
        data: {
            userId,
            action: "ASSET_DISPOSED",
            entityType: "ASSET",
            entityId: id
        }
    });

    return {
        status: 200,
        data: { success: true, message: "Asset marked as DISPOSED successfully." }
    };
};