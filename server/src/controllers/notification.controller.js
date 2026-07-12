const service = require('../services/notification.service');

exports.getAll = async (req, res) => {
    const response = await service.getAll(req.body);
    return res.status(501).json(response);
};

exports.markAsRead = async (req, res) => {
    const response = await service.markAsRead(req.body);
    return res.status(501).json(response);
};

exports.deleteNotification = async (req, res) => {
    const response = await service.deleteNotification(req.body);
    return res.status(501).json(response);
};