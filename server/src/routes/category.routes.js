const express = require('express');
const router = express.Router();
const controller = require('../controllers/category.controller');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.patch('/:id', controller.update);
router.delete('/:id', controller.deleteCategory);

module.exports = router;