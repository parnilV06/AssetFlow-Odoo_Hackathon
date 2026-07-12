const express = require('express');
const router = express.Router();
const controller = require('../controllers/asset.controller');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.patch('/:id', controller.update);
router.delete('/:id', controller.deleteAsset);
router.get('/search', controller.search);
router.get('/filter', controller.filter);
router.get('/:id/history', controller.getHistory);
router.get('/:id/qr', controller.getQR);

module.exports = router;