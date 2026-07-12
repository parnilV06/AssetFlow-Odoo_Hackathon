const express = require('express');
const router = express.Router();
const controller = require('../controllers/maintenance.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { roleMiddleware } = require('../middleware/role.middleware');
const { validateMiddleware } = require('../middleware/validate.middleware');

router.get('/', authMiddleware, controller.getAll);
router.get('/:id', authMiddleware, controller.getById);

// Any authenticated user can POST
router.post('/', authMiddleware, validateMiddleware(controller.createSchema), controller.create);

// Only ADMIN and ASSET_MANAGER can PATCH
router.patch('/:id', authMiddleware, roleMiddleware('ADMIN', 'ASSET_MANAGER'), validateMiddleware(controller.updateSchema), controller.update);

module.exports = router;