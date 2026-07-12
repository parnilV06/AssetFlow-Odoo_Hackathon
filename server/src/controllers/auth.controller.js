const service = require('../services/auth.service');
const { z } = require('zod');

const signupSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters").trim(),
    email: z.string().email("Invalid email address").trim(),
    password: z.string().min(8, "Password must be at least 8 characters")
});

const loginSchema = z.object({
    email: z.string().email("Invalid email address").trim(),
    password: z.string().min(1, "Password is required")
});

exports.signupSchema = signupSchema;
exports.loginSchema = loginSchema;

exports.signup = async (req, res) => {
    try {
        const response = await service.signup(req.body);
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.login = async (req, res) => {
    try {
        const response = await service.login(req.body);
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getMe = async (req, res) => {
    try {
        const response = await service.getMe(req.user.id);
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.logout = async (req, res) => {
    try {
        const response = await service.logout();
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const response = await service.forgotPassword();
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};