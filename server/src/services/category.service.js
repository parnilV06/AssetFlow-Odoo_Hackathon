const { prisma } = require('../config/prisma');

exports.getAll = async (query) => {
    const { status, search } = query;
    const where = {};
    
    if (status) {
        where.status = status;
    }
    
    if (search) {
        where.name = { contains: search, mode: 'insensitive' };
    }

    const categories = await prisma.category.findMany({ where });

    return {
        status: 200,
        data: { success: true, data: categories }
    };
};

exports.getById = async (id) => {
    const category = await prisma.category.findUnique({
        where: { id },
        include: {
            _count: {
                select: { assets: true }
            }
        }
    });

    if (!category) {
        return {
            status: 404,
            data: { success: false, message: "Category not found" }
        };
    }

    const result = {
        id: category.id,
        name: category.name,
        description: category.description,
        status: category.status,
        assetCount: category._count.assets
    };

    return {
        status: 200,
        data: { success: true, data: result }
    };
};

exports.create = async (data, userId) => {
    const { name, description } = data;

    const existing = await prisma.category.findFirst({
        where: { name: { equals: name, mode: 'insensitive' } }
    });

    if (existing) {
        return {
            status: 409,
            data: { success: false, message: "Category name already exists" }
        };
    }

    const category = await prisma.category.create({
        data: {
            name,
            description,
            status: 'ACTIVE'
        }
    });

    await prisma.activityLog.create({
        data: {
            userId,
            action: "CATEGORY_CREATED",
            entityType: "CATEGORY",
            entityId: category.id
        }
    });

    return {
        status: 201,
        data: { success: true, message: "Category created successfully", data: category }
    };
};

exports.update = async (id, data, userId) => {
    const { name, description, status } = data;
    
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
        return {
            status: 404,
            data: { success: false, message: "Category not found" }
        };
    }

    if (name && name.toLowerCase() !== category.name.toLowerCase()) {
        const existing = await prisma.category.findFirst({
            where: { name: { equals: name, mode: 'insensitive' } }
        });
        if (existing) {
            return {
                status: 409,
                data: { success: false, message: "Category name already exists" }
            };
        }
    }

    const updated = await prisma.category.update({
        where: { id },
        data: {
            ...(name && { name }),
            ...(description !== undefined && { description }),
            ...(status && { status })
        }
    });

    await prisma.activityLog.create({
        data: {
            userId,
            action: "CATEGORY_UPDATED",
            entityType: "CATEGORY",
            entityId: id
        }
    });

    return {
        status: 200,
        data: { success: true, message: "Category updated successfully", data: updated }
    };
};

exports.deleteCategory = async (id, userId) => {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
        return {
            status: 404,
            data: { success: false, message: "Category not found" }
        };
    }

    const assetsCount = await prisma.asset.count({
        where: { categoryId: id }
    });

    if (assetsCount > 0) {
        return {
            status: 409,
            data: { success: false, message: "Category contains existing assets." }
        };
    }

    await prisma.category.update({
        where: { id },
        data: { status: 'INACTIVE' }
    });

    await prisma.activityLog.create({
        data: {
            userId,
            action: "CATEGORY_DEACTIVATED",
            entityType: "CATEGORY",
            entityId: id
        }
    });

    return {
        status: 200,
        data: { success: true, message: "Category deactivated successfully" }
    };
};