const { prisma } = require('../config/prisma');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

exports.getAll = async (query) => {
    const { search, department, role, status } = query;
    const where = {};
    
    if (department) where.departmentId = department;
    if (role) where.role = role;
    if (status) where.status = status;
    
    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } }
        ];
    }

    const employees = await prisma.user.findMany({
        where,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            departmentId: true,
            createdAt: true,
            updatedAt: true,
            department: true
        }
    });

    return {
        status: 200,
        data: { success: true, data: employees }
    };
};

exports.getById = async (id) => {
    const employee = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            departmentId: true,
            createdAt: true,
            updatedAt: true,
            department: true
        }
    });

    if (!employee) {
        return {
            status: 404,
            data: { success: false, message: "Employee not found" }
        };
    }

    return {
        status: 200,
        data: { success: true, data: employee }
    };
};

exports.create = async (data, userId) => {
    const { name, email, departmentId } = data;

    const existing = await prisma.user.findUnique({
        where: { email }
    });

    if (existing) {
        return {
            status: 409,
            data: { success: false, message: "Email already exists" }
        };
    }

    const department = await prisma.department.findUnique({
        where: { id: departmentId }
    });

    if (!department || department.status !== 'ACTIVE') {
        return {
            status: 400,
            data: { success: false, message: "Department must exist and be ACTIVE" }
        };
    }

    const tempPassword = crypto.randomBytes(8).toString('hex');
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const employee = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: 'EMPLOYEE',
            status: 'ACTIVE',
            departmentId
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            departmentId: true,
            createdAt: true,
            updatedAt: true
        }
    });

    await prisma.activityLog.create({
        data: {
            userId,
            action: "EMPLOYEE_CREATED",
            entityType: "USER",
            entityId: employee.id
        }
    });

    return {
        status: 201,
        data: { success: true, message: "Employee created successfully", data: employee }
    };
};

exports.update = async (id, data, userId) => {
    const { name, departmentId, status } = data;
    
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
        return {
            status: 404,
            data: { success: false, message: "Employee not found" }
        };
    }

    if (departmentId && departmentId !== user.departmentId) {
        const department = await prisma.department.findUnique({ where: { id: departmentId } });
        if (!department || department.status !== 'ACTIVE') {
            return {
                status: 400,
                data: { success: false, message: "Department must exist and be ACTIVE" }
            };
        }
    }

    if (status === 'INACTIVE' && user.role === 'DEPARTMENT_HEAD') {
        return {
            status: 400,
            data: { success: false, message: "Inactive users cannot be assigned as Department Heads. Demote user first." }
        };
    }

    const updated = await prisma.user.update({
        where: { id },
        data: {
            ...(name && { name }),
            ...(departmentId && { departmentId }),
            ...(status && { status })
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            departmentId: true,
            createdAt: true,
            updatedAt: true
        }
    });

    await prisma.activityLog.create({
        data: {
            userId,
            action: "EMPLOYEE_UPDATED",
            entityType: "USER",
            entityId: id
        }
    });

    return {
        status: 200,
        data: { success: true, message: "Employee updated successfully", data: updated }
    };
};

exports.updateRole = async (id, role, userId) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
        return {
            status: 404,
            data: { success: false, message: "Employee not found" }
        };
    }

    if (user.role === 'ADMIN') {
        return {
            status: 403,
            data: { success: false, message: "Cannot modify ADMIN roles through this endpoint." }
        };
    }

    if (user.role === role) {
        return {
            status: 400,
            data: { success: false, message: "User already has this role." }
        };
    }

    // Role checks
    // If moving to DEPARTMENT_HEAD, verify no other department head exists in their department
    if (role === 'DEPARTMENT_HEAD') {
        const existingHead = await prisma.user.findFirst({
            where: {
                departmentId: user.departmentId,
                role: 'DEPARTMENT_HEAD',
                status: 'ACTIVE'
            }
        });
        if (existingHead) {
            return {
                status: 409,
                data: { success: false, message: "A Department Head already exists for this department." }
            };
        }
    }

    const updated = await prisma.user.update({
        where: { id },
        data: { role },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            departmentId: true
        }
    });

    await prisma.activityLog.create({
        data: {
            userId,
            action: "ROLE_CHANGED",
            entityType: "USER",
            entityId: id,
            metadata: { oldRole: user.role, newRole: role }
        }
    });

    await prisma.notification.create({
        data: {
            userId: id,
            title: "Role Updated",
            message: `Your role has been updated to ${role}.`
        }
    });

    return {
        status: 200,
        data: { success: true, message: "Role updated successfully", data: updated }
    };
};

exports.deleteEmployee = async (id, userId) => {
    if (id === userId) {
        return {
            status: 400,
            data: { success: false, message: "Cannot delete yourself." }
        };
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
        return {
            status: 404,
            data: { success: false, message: "Employee not found" }
        };
    }

    if (user.role === 'ADMIN') {
        const adminCount = await prisma.user.count({
            where: { role: 'ADMIN', status: 'ACTIVE' }
        });
        if (adminCount <= 1) {
            return {
                status: 403,
                data: { success: false, message: "Cannot delete the final ADMIN account." }
            };
        }
    }

    const activeAllocations = await prisma.allocation.count({
        where: { userId: id, returnedAt: null }
    });
    if (activeAllocations > 0) {
        return {
            status: 409,
            data: { success: false, message: "Employee currently has active allocated assets." }
        };
    }

    const activeBookings = await prisma.booking.count({
        where: { userId: id, status: { in: ['UPCOMING', 'ONGOING'] } }
    });
    if (activeBookings > 0) {
        return {
            status: 409,
            data: { success: false, message: "Employee has active bookings." }
        };
    }

    const activeMaintenance = await prisma.maintenanceRequest.count({
        where: { requesterId: id, status: { in: ['PENDING', 'APPROVED', 'ASSIGNED', 'IN_PROGRESS'] } }
    });
    if (activeMaintenance > 0) {
        return {
            status: 409,
            data: { success: false, message: "Employee has maintenance requests in progress." }
        };
    }

    await prisma.user.update({
        where: { id },
        data: { status: 'INACTIVE' }
    });

    await prisma.activityLog.create({
        data: {
            userId,
            action: "EMPLOYEE_DEACTIVATED",
            entityType: "USER",
            entityId: id
        }
    });

    return {
        status: 200,
        data: { success: true, message: "Employee deactivated successfully" }
    };
};