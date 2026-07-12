const service = require('../services/maintenance.service');
const { z } = require('zod');

const createSchema = z.object({
    assetId: z.string().uuid(),
    description: z.string().min(10).max(500).trim(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
}).strict();

const updateSchema = z.object({
    status: z.enum(['APPROVED', 'REJECTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED']),
    technicianId: z.string().uuid().optional()
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

exports.getAssetHistory = async (req, res) => {
    try {
        const response = await service.getAssetHistory(req.params.id);
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};