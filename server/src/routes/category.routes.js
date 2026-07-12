const express = require('express');
const router = express.Router();
const controller = require('../controllers/category.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { roleMiddleware } = require('../middleware/role.middleware');
const { validateMiddleware } = require('../middleware/validate.middleware');

router.get('/', authMiddleware, controller.getAll);
router.get('/:id', authMiddleware, controller.getById);
router.post('/', authMiddleware, roleMiddleware('ADMIN'), validateMiddleware(controller.createSchema), controller.create);
router.patch('/:id', authMiddleware, roleMiddleware('ADMIN'), validateMiddleware(controller.updateSchema), controller.update);
router.delete('/:id', authMiddleware, roleMiddleware('ADMIN'), controller.deleteCategory);

module.exports = router;