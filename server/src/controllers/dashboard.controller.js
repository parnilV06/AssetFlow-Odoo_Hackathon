const service = require('../services/dashboard.service');

exports.getDashboard = async (req, res) => {
    const response = await service.getDashboard(req.body);
    return res.status(501).json(response);
};