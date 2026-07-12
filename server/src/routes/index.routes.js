// main router file to mount all other routes to /api endpoints
const express = require('express');
const router = express.Router();

// Import all route modules
const authRoutes = require('./auth.routes');
const assetRoutes = require('./asset.routes');
const bookingRoutes = require('./booking.routes');
const employeeRoutes = require('./employee.routes');
const maintenanceRoutes = require('./maintenance.routes');
const dashboardRoutes = require('./dashboard.routes');
const allocationRoutes = require('./allocation.routes');

// Mount routes with appropriate base paths
router.use('/auth', authRoutes);
router.use('/assets', assetRoutes);
router.use('/bookings', bookingRoutes);
router.use('/employees', employeeRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/allocations', allocationRoutes);

module.exports = router;