const service = require('../services/asset.service');
const { z } = require('zod');

const createSchema = z.object({
    name: z.string().min(3).max(100).trim(),
    categoryId: z.string().uuid(),
    departmentId: z.string().uuid(),
    serialNumber: z.string().trim(),
    condition: z.string().trim(),
    location: z.string().trim(),
    acquisitionDate: z.string().refine((date) => new Date(date) <= new Date(), { message: "Cannot be a future date" }),
    acquisitionCost: z.number().min(0),
    isBookable: z.boolean(),
    imageUrl: z.string().optional()
}).strict();

const updateSchema = z.object({
    name: z.string().min(3).max(100).trim().optional(),
    categoryId: z.string().uuid().optional(),
    departmentId: z.string().uuid().optional(),
    condition: z.string().trim().optional(),
    location: z.string().trim().optional(),
    acquisitionDate: z.string().refine((date) => new Date(date) <= new Date(), { message: "Cannot be a future date" }).optional(),
    acquisitionCost: z.number().min(0).optional(),
    isBookable: z.boolean().optional(),
    imageUrl: z.string().optional()
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

exports.getHistory = async (req, res) => {
    try {
        const response = await service.getHistory(req.params.id);
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getQr = async (req, res) => {
    try {
        const response = await service.getQr(req.params.id);
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

exports.deleteAsset = async (req, res) => {
    try {
        const response = await service.deleteAsset(req.params.id, req.user.id);
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};