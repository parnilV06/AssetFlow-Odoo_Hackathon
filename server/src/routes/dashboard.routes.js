const express = require('express');
const router = express.Router();

const controller = require('../controllers/dashboard.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

// ============================================================================
// Dashboard Routes (/api/dashboard)
// ============================================================================

// Note: roleMiddleware is intentionally omitted. The service branches logic 
// based on req.user.role returned by authMiddleware.
router.get('/', authMiddleware, controller.getDashboard);

module.exports = router;