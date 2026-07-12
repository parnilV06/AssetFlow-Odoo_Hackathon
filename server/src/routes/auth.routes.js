const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { validateMiddleware } = require('../middleware/validate.middleware');

router.post('/signup', validateMiddleware(controller.signupSchema), controller.signup);
router.post('/login', validateMiddleware(controller.loginSchema), controller.login);
router.get('/me', authMiddleware, controller.getMe);
router.post('/logout', controller.logout);
router.post('/forgot-password', controller.forgotPassword);

module.exports = router;