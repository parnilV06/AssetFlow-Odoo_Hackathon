const express = require('express');
const router = express.Router();
const controller = require('../controllers/employee.controller');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.patch('/:id', controller.update);
router.delete('/:id', controller.deleteEmployee);
router.patch('/:id/role', controller.updateRole);

module.exports = router;