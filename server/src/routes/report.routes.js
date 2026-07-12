const express = require('express');
const router = express.Router();
const controller = require('../controllers/report.controller');

router.get('/assets', controller.getAssets);
router.get('/maintenance', controller.getMaintenance);
router.get('/bookings', controller.getBookings);
router.get('/dashboard', controller.getDashboard);
router.get('/utilization', controller.getUtilization);

module.exports = router;