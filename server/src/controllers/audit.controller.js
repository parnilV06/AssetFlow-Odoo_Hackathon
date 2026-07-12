const service = require('../services/audit.service');

exports.getAll = async (req, res) => {
    const response = await service.getAll(req.body);
    return res.status(501).json(response);
};

exports.getById = async (req, res) => {
    const response = await service.getById(req.body);
    return res.status(501).json(response);
};

exports.create = async (req, res) => {
    const response = await service.create(req.body);
    return res.status(501).json(response);
};

exports.update = async (req, res) => {
    const response = await service.update(req.body);
    return res.status(501).json(response);
};

exports.deleteAudit = async (req, res) => {
    const response = await service.deleteAudit(req.body);
    return res.status(501).json(response);
};

exports.close = async (req, res) => {
    const response = await service.close(req.body);
    return res.status(501).json(response);
};