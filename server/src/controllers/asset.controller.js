const service = require('../services/asset.service');

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

exports.deleteAsset = async (req, res) => {
    const response = await service.deleteAsset(req.body);
    return res.status(501).json(response);
};

exports.search = async (req, res) => {
    const response = await service.search(req.body);
    return res.status(501).json(response);
};

exports.filter = async (req, res) => {
    const response = await service.filter(req.body);
    return res.status(501).json(response);
};

exports.getHistory = async (req, res) => {
    const response = await service.getHistory(req.body);
    return res.status(501).json(response);
};

exports.getQR = async (req, res) => {
    const response = await service.getQR(req.body);
    return res.status(501).json(response);
};