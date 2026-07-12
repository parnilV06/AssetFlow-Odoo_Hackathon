const express = require('express');
const router = express.Router();
const controller = require('../controllers/allocation.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { roleMiddleware } = require('../middleware/role.middleware');
const { validateMiddleware } = require('../middleware/validate.middleware');

router.get('/', authMiddleware, controller.getAll);
router.get('/:id', authMiddleware, controller.getById);

router.post('/allocate', authMiddleware, roleMiddleware('ADMIN', 'ASSET_MANAGER'), validateMiddleware(controller.allocateSchema), controller.allocate);
router.post('/return', authMiddleware, roleMiddleware('ADMIN', 'ASSET_MANAGER'), validateMiddleware(controller.returnSchema), controller.returnAsset);
router.post('/transfer', authMiddleware, roleMiddleware('ADMIN', 'ASSET_MANAGER'), validateMiddleware(controller.transferSchema), controller.transfer);

module.exports = router;