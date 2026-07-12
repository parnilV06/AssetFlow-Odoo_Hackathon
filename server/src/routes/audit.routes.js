const express = require('express');
const router = express.Router();
const controller = require('../controllers/audit.controller');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.patch('/:id', controller.update);
router.delete('/:id', controller.deleteAudit);
router.post('/:id/close', controller.close);

module.exports = router;