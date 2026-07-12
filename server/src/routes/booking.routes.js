const express = require('express');
const router = express.Router();

const controller = require('../controllers/booking.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { roleMiddleware } = require('../middleware/role.middleware');
const { validateMiddleware } = require('../middleware/validate.middleware');

// ============================================================================
// Booking Routes (/api/bookings)
// ============================================================================

// Note: /calendar is declared before /:id so Express matches it correctly.
router.get('/', authMiddleware, controller.getAll);
router.get('/calendar', authMiddleware, controller.getCalendar);
router.get('/:id', authMiddleware, controller.getById);

router.post('/', 
    authMiddleware, 
    validateMiddleware(controller.createSchema), 
    controller.create
);

router.patch('/:id/cancel', 
    authMiddleware, 
    controller.cancel
);

router.patch('/:id/status', 
    authMiddleware, 
    roleMiddleware('ADMIN', 'ASSET_MANAGER'), 
    validateMiddleware(controller.updateStatusSchema), 
    controller.updateStatus
);

module.exports = router;