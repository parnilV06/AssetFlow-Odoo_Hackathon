const service = require('../services/category.service');

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

exports.deleteCategory = async (req, res) => {
    const response = await service.deleteCategory(req.body);
    return res.status(501).json(response);
};