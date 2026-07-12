const express = require('express');
const router = express.Router();
const controller = require('../controllers/asset.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { roleMiddleware } = require('../middleware/role.middleware');
const { validateMiddleware } = require('../middleware/validate.middleware');

router.get('/', authMiddleware, controller.getAll);
router.get('/:id', authMiddleware, controller.getById);
router.get('/:id/history', authMiddleware, controller.getHistory);
router.get('/:id/allocation-history', authMiddleware, require('../controllers/allocation.controller').getAssetHistory);
router.get('/:id/maintenance-history', authMiddleware, require('../controllers/maintenance.controller').getAssetHistory);
router.get('/:id/qr', authMiddleware, controller.getQr);
router.post('/', authMiddleware, roleMiddleware('ADMIN', 'ASSET_MANAGER'), validateMiddleware(controller.createSchema), controller.create);
router.patch('/:id', authMiddleware, roleMiddleware('ADMIN', 'ASSET_MANAGER'), validateMiddleware(controller.updateSchema), controller.update);
router.delete('/:id', authMiddleware, roleMiddleware('ADMIN'), controller.deleteAsset);

module.exports = router;