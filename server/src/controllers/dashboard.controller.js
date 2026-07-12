const service = require('../services/dashboard.service');

exports.getDashboard = async (req, res) => {
    try {
        // Pass only req.user to the service, where role-based logic handles the rest
        const response = await service.getDashboard(req.user);
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};