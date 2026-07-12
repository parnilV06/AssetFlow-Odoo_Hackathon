const service = require('../services/activity.service');

exports.getAll = async (req, res) => {
    const response = await service.getAll(req.body);
    return res.status(501).json(response);
};

exports.getById = async (req, res) => {
    const response = await service.getById(req.body);
    return res.status(501).json(response);
};