const express = require('express');
const router = express.Router();
const controller = require('../controllers/employee.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { roleMiddleware } = require('../middleware/role.middleware');
const { validateMiddleware } = require('../middleware/validate.middleware');

router.get('/', authMiddleware, controller.getAll);
router.get('/:id', authMiddleware, controller.getById);
router.post('/', authMiddleware, roleMiddleware('ADMIN'), validateMiddleware(controller.createSchema), controller.create);
router.patch('/:id', authMiddleware, roleMiddleware('ADMIN'), validateMiddleware(controller.updateSchema), controller.update);
router.patch('/:id/role', authMiddleware, roleMiddleware('ADMIN'), validateMiddleware(controller.updateRoleSchema), controller.updateRole);
router.delete('/:id', authMiddleware, roleMiddleware('ADMIN'), controller.deleteEmployee);

module.exports = router;