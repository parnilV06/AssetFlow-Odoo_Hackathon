const service = require('../services/employee.service');
const { z } = require('zod');

const createSchema = z.object({
    name: z.string().min(3).max(100).trim(),
    email: z.string().email().toLowerCase().trim(),
    departmentId: z.string().uuid()
}).strict();

const updateSchema = z.object({
    name: z.string().min(3).max(100).trim().optional(),
    departmentId: z.string().uuid().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional()
}).strict();

const updateRoleSchema = z.object({
    role: z.enum(['EMPLOYEE', 'ASSET_MANAGER', 'DEPARTMENT_HEAD'])
}).strict();

exports.createSchema = createSchema;
exports.updateSchema = updateSchema;
exports.updateRoleSchema = updateRoleSchema;

exports.getAll = async (req, res) => {
    try {
        const response = await service.getAll(req.query);
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getById = async (req, res) => {
    try {
        const response = await service.getById(req.params.id);
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.create = async (req, res) => {
    try {
        const response = await service.create(req.body, req.user.id);
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.update = async (req, res) => {
    try {
        const response = await service.update(req.params.id, req.body, req.user.id);
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.updateRole = async (req, res) => {
    try {
        const response = await service.updateRole(req.params.id, req.body.role, req.user.id);
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        const response = await service.deleteEmployee(req.params.id, req.user.id);
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};