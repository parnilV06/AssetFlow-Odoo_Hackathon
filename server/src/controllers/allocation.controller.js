const service = require('../services/allocation.service');

exports.allocate = async (req, res) => {
    const response = await service.allocate(req.body);
    return res.status(501).json(response);
};

exports.returnAsset = async (req, res) => {
    const response = await service.returnAsset(req.body);
    return res.status(501).json(response);
};

exports.transfer = async (req, res) => {
    const response = await service.transfer(req.body);
    return res.status(501).json(response);
};

exports.getHistory = async (req, res) => {
    const response = await service.getHistory(req.body);
    return res.status(501).json(response);
};