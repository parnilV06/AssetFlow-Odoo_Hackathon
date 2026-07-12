const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');

router.post('/login', controller.login);
router.post('/signup', controller.signup);
router.get('/me', controller.getMe);

module.exports = router;