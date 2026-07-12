const { prisma } = require('../config/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = async (data) => {
    const { name, email, password } = data;
    const lowerEmail = email.toLowerCase();

    const existingUser = await prisma.user.findUnique({
        where: { email: lowerEmail }
    });

    if (existingUser) {
        return {
            status: 409,
            data: { success: false, message: "Email already exists" }
        };
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';

    const defaultDept = await prisma.department.findFirst();

    if (!defaultDept) {
        return {
            status: 500,
            data: { success: false, message: "No departments available to assign to user" }
        };
    }

    const newUser = await prisma.user.create({
        data: {
            firstName,
            lastName,
            email: lowerEmail,
            passwordHash: hashedPassword,
            role: "Employee",
            isActive: true,
            departmentId: defaultDept.id
        }
    });

    await prisma.activityLog.create({
        data: {
            userId: newUser.id,
            action: "USER_REGISTERED",
            entityType: "USER",
            entityId: newUser.id
        }
    });

    return {
        status: 201,
        data: { success: true, message: "Account created successfully" }
    };
};

exports.login = async (data) => {
    const { email, password } = data;
    const lowerEmail = email.toLowerCase();

    const user = await prisma.user.findUnique({
        where: { email: lowerEmail }
    });

    if (!user) {
        return {
            status: 401,
            data: { success: false, message: "Invalid credentials" }
        };
    }

    if (user.isActive === false) {
        return {
            status: 401,
            data: { success: false, message: "Account is not active" }
        };
    }

    // Note: lockedUntil and failedLoginAttempts do not exist in current schema, skipping lock logic
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
        return {
            status: 401,
            data: { success: false, message: "Invalid credentials" }
        };
    }

    const tokenPayload = {
        id: user.id,
        email: user.email,
        role: user.role
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '7d' });

    await prisma.activityLog.create({
        data: {
            userId: user.id,
            action: "USER_LOGIN",
            entityType: "USER",
            entityId: user.id
        }
    });

    return {
        status: 200,
        data: {
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        }
    };
};

exports.getMe = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            departmentId: true,
            status: true
        }
    });

    if (!user) {
        return {
            status: 401,
            data: { success: false, message: "Unauthorized" }
        };
    }

    return {
        status: 200,
        data: {
            success: true,
            data: user
        }
    };
};

exports.logout = async () => {
    return {
        status: 200,
        data: {
            success: true,
            message: "Logout successful"
        }
    };
};

exports.forgotPassword = async () => {
    return {
        status: 501,
        data: {
            success: false,
            message: "Not implemented"
        }
    };
};