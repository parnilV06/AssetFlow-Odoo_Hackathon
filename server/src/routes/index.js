const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const dashboardRoutes = require('./dashboard.routes');
const departmentRoutes = require('./department.routes');
const employeeRoutes = require('./employee.routes');
const categoryRoutes = require('./category.routes');
const assetRoutes = require('./asset.routes');
const allocationRoutes = require('./allocation.routes');
const bookingRoutes = require('./booking.routes');
const maintenanceRoutes = require('./maintenance.routes');
const auditRoutes = require('./audit.routes');
const reportRoutes = require('./report.routes');
const notificationRoutes = require('./notification.routes');
const activityRoutes = require('./activity.routes');

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/departments', departmentRoutes);
router.use('/employees', employeeRoutes);
router.use('/categories', categoryRoutes);
router.use('/assets', assetRoutes);
router.use('/allocation', allocationRoutes);
router.use('/bookings', bookingRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/audit', auditRoutes);
router.use('/reports', reportRoutes);
router.use('/notifications', notificationRoutes);
router.use('/activity', activityRoutes);

module.exports = router;