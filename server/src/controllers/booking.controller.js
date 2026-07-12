const { z } = require('zod');
const service = require('../services/booking.service');

// ============================================================================
// Validation Schemas
// ============================================================================

const createSchema = z.object({
    assetId: z.string().uuid(),
    startTime: z.string().datetime({ message: "startTime must be ISO 8601" }),
    endTime: z.string().datetime({ message: "endTime must be ISO 8601" }),
    purpose: z.string().max(500).trim().optional()
}).strict();
exports.createSchema = createSchema;

const updateStatusSchema = z.object({
    status: z.enum(['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'])
}).strict();
exports.updateStatusSchema = updateStatusSchema;

// ============================================================================
// Controllers
// ============================================================================

exports.getAll = async (req, res) => {
    try {
        const response = await service.getAll(req.query);
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getCalendar = async (req, res) => {
    try {
        const response = await service.getCalendar(req.query);
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

exports.cancel = async (req, res) => {
    try {
        const response = await service.cancel(req.params.id, req.user.id, req.user.role);
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const response = await service.updateStatus(req.params.id, req.body.status, req.user.id);
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};