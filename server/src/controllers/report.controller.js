const service = require('../services/report.service');

exports.getAssets = async (req, res) => {
    const response = await service.getAssets(req.body);
    return res.status(501).json(response);
};

exports.getMaintenance = async (req, res) => {
    const response = await service.getMaintenance(req.body);
    return res.status(501).json(response);
};

exports.getBookings = async (req, res) => {
    const response = await service.getBookings(req.body);
    return res.status(501).json(response);
};

exports.getDashboard = async (req, res) => {
    const response = await service.getDashboard(req.body);
    return res.status(501).json(response);
};

exports.getUtilization = async (req, res) => {
    const response = await service.getUtilization(req.body);
    return res.status(501).json(response);
};