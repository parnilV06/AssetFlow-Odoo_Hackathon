const { prisma } = require('../config/prisma');

const checkCircularHierarchy = async (departmentId, newParentId) => {
    let currentId = newParentId;
    while (currentId) {
        if (currentId === departmentId) return true;
        const parent = await prisma.department.findUnique({
            where: { id: currentId },
            select: { parentDepartmentId: true }
        });
        currentId = parent ? parent.parentDepartmentId : null;
    }
    return false;
};

exports.getAll = async (query) => {
    const { status, search } = query;
    const where = {};
    
    if (status) {
        where.status = status;
    }
    
    if (search) {
        where.name = { contains: search, mode: 'insensitive' };
    }

    const departments = await prisma.department.findMany({
        where,
        include: {
            parentDepartment: true,
            departmentHead: true
        }
    });

    return {
        status: 200,
        data: { success: true, data: departments }
    };
};

exports.getById = async (id) => {
    const department = await prisma.department.findUnique({
        where: { id },
        include: {
            parentDepartment: true,
            departmentHead: true,
            _count: {
                select: { users: true } // Number of employees
            }
        }
    });

    if (!department) {
        return {
            status: 404,
            data: { success: false, message: "Department not found" }
        };
    }

    // Attempting to calculate assets based on users allocated in the department
    // In a real scenario, this would depend on the schema design for Assets vs Departments
    const assetsCount = await prisma.allocation.count({
        where: { user: { departmentId: id }, returnedAt: null }
    }).catch(() => 0); // fallback if allocation doesn't exist

    const result = {
        ...department,
        employeeCount: department._count.users,
        assetCount: assetsCount
    };
    
    delete result._count;

    return {
        status: 200,
        data: { success: true, data: result }
    };
};

exports.create = async (data, userId) => {
    const { name, parentDepartmentId, headId } = data;

    // Check unique name case insensitive
    const existing = await prisma.department.findFirst({
        where: { name: { equals: name, mode: 'insensitive' } }
    });

    if (existing) {
        return {
            status: 409,
            data: { success: false, message: "Department name already exists" }
        };
    }

    if (parentDepartmentId) {
        const parent = await prisma.department.findUnique({ where: { id: parentDepartmentId } });
        if (!parent) {
            return {
                status: 400,
                data: { success: false, message: "Parent department does not exist" }
            };
        }
    }

    if (headId) {
        const head = await prisma.user.findUnique({ where: { id: headId } });
        if (!head || head.status !== 'ACTIVE') {
            return {
                status: 400,
                data: { success: false, message: "Department head must exist and be ACTIVE" }
            };
        }
    }

    const department = await prisma.department.create({
        data: {
            name,
            parentDepartmentId,
            headId,
            status: 'ACTIVE'
        }
    });

    await prisma.activityLog.create({
        data: {
            userId,
            action: "DEPARTMENT_CREATED",
            entityType: "DEPARTMENT",
            entityId: department.id
        }
    });

    return {
        status: 201,
        data: { success: true, message: "Department created successfully", data: department }
    };
};

exports.update = async (id, data, userId) => {
    const { name, status, parentDepartmentId, headId } = data;
    
    const department = await prisma.department.findUnique({ where: { id } });
    if (!department) {
        return {
            status: 404,
            data: { success: false, message: "Department not found" }
        };
    }

    if (name && name.toLowerCase() !== department.name.toLowerCase()) {
        const existing = await prisma.department.findFirst({
            where: { name: { equals: name, mode: 'insensitive' } }
        });
        if (existing) {
            return {
                status: 409,
                data: { success: false, message: "Department name already exists" }
            };
        }
    }

    if (parentDepartmentId !== undefined) {
        if (parentDepartmentId === id) {
            return {
                status: 400,
                data: { success: false, message: "Department cannot be its own parent" }
            };
        }
        
        if (parentDepartmentId) {
            const parent = await prisma.department.findUnique({ where: { id: parentDepartmentId } });
            if (!parent) {
                return {
                    status: 400,
                    data: { success: false, message: "Parent department does not exist" }
                };
            }
            const isCircular = await checkCircularHierarchy(id, parentDepartmentId);
            if (isCircular) {
                return {
                    status: 400,
                    data: { success: false, message: "Circular hierarchy detected" }
                };
            }
        }
    }

    if (headId) {
        const head = await prisma.user.findUnique({ where: { id: headId } });
        if (!head || head.status !== 'ACTIVE' || head.departmentId !== id) {
            return {
                status: 400,
                data: { success: false, message: "Department head must exist, be ACTIVE, and belong to this department" }
            };
        }
    }

    const updated = await prisma.department.update({
        where: { id },
        data: {
            ...(name && { name }),
            ...(status && { status }),
            ...(parentDepartmentId !== undefined && { parentDepartmentId }),
            ...(headId !== undefined && { headId })
        }
    });

    await prisma.activityLog.create({
        data: {
            userId,
            action: "DEPARTMENT_UPDATED",
            entityType: "DEPARTMENT",
            entityId: id
        }
    });

    return {
        status: 200,
        data: { success: true, message: "Department updated successfully", data: updated }
    };
};

exports.deleteDepartment = async (id, userId) => {
    const department = await prisma.department.findUnique({ where: { id } });
    if (!department) {
        return {
            status: 404,
            data: { success: false, message: "Department not found" }
        };
    }

    const activeUsers = await prisma.user.count({
        where: { departmentId: id, status: 'ACTIVE' }
    });

    if (activeUsers > 0) {
        return {
            status: 409,
            data: { success: false, message: "Department contains active resources." }
        };
    }

    // Checking active assets (indirectly via allocations)
    const activeAllocations = await prisma.allocation.count({
        where: { user: { departmentId: id }, returnedAt: null }
    }).catch(() => 0);

    if (activeAllocations > 0) {
        return {
            status: 409,
            data: { success: false, message: "Department contains active resources." }
        };
    }

    await prisma.department.update({
        where: { id },
        data: { status: 'INACTIVE' }
    });

    await prisma.activityLog.create({
        data: {
            userId,
            action: "DEPARTMENT_DEACTIVATED",
            entityType: "DEPARTMENT",
            entityId: id
        }
    });

    return {
        status: 200,
        data: { success: true, message: "Department deleted successfully" }
    };
};