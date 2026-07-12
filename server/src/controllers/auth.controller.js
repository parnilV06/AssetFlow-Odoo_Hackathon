const service = require('../services/auth.service');

exports.login = async (req, res) => {
    const response = await service.login(req.body);
    return res.status(501).json(response);
};

exports.signup = async (req, res) => {
    const response = await service.signup(req.body);
    return res.status(501).json(response);
};

exports.getMe = async (req, res) => {
    const response = await service.getMe(req.body);
    return res.status(501).json(response);
};