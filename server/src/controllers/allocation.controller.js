const service = require('../services/allocation.service');
const { z } = require('zod');

const allocateSchema = z.object({
    assetId: z.string().uuid(),
    employeeId: z.string().uuid(),
    expectedReturn: z.string().refine(date => new Date(date) >= new Date(new Date().setHours(0, 0, 0, 0)), { message: "Cannot be before today" }).optional(),
    conditionNotes: z.string().trim().optional()
}).strict();

const returnSchema = z.object({
    assetId: z.string().uuid(),
    conditionNotes: z.string().trim().optional()
}).strict();

const transferSchema = z.object({
    assetId: z.string().uuid(),
    newEmployeeId: z.string().uuid(),
    expectedReturn: z.string().refine(date => new Date(date) >= new Date(new Date().setHours(0, 0, 0, 0)), { message: "Cannot be before today" }).optional()
}).strict();

exports.allocateSchema = allocateSchema;
exports.returnSchema = returnSchema;
exports.transferSchema = transferSchema;

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

exports.allocate = async (req, res) => {
    try {
        const response = await service.allocate(req.body, req.user.id);
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.returnAsset = async (req, res) => {
    try {
        const response = await service.returnAsset(req.body, req.user.id);
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.transfer = async (req, res) => {
    try {
        const response = await service.transfer(req.body, req.user.id);
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