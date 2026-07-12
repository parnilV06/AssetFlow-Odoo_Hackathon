const express = require('express');
const router = express.Router();
const controller = require('../controllers/booking.controller');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.patch('/:id', controller.update);
router.delete('/:id', controller.deleteBooking);
router.get('/calendar', controller.getCalendar);

module.exports = router;