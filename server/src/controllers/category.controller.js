const service = require('../services/category.service');
const { z } = require('zod');

const createSchema = z.object({
    name: z.string().min(2).max(50).trim(),
    description: z.string().max(500).trim().optional()
}).strict();

const updateSchema = z.object({
    name: z.string().min(2).max(50).trim().optional(),
    description: z.string().max(500).trim().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional()
}).strict();

exports.createSchema = createSchema;
exports.updateSchema = updateSchema;

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

exports.deleteCategory = async (req, res) => {
    try {
        const response = await service.deleteCategory(req.params.id, req.user.id);
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};