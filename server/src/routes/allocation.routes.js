const express = require('express');
const router = express.Router();
const controller = require('../controllers/allocation.controller');

router.post('/allocate', controller.allocate);
router.post('/return', controller.returnAsset);
router.post('/transfer', controller.transfer);
router.get('/history/:assetId', controller.getHistory);

module.exports = router;