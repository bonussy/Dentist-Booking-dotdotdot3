const express = require('express');
const { getDentists, createDentist } = require('../controllers/dentists');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

//Include other resource routers
const bookingRouter = require('./bookings');

//Re-route into other resource routers
router.use('/:dentistId/bookings/', bookingRouter);

router.route('/')
    .get(protect, getDentists)
    .post(protect, authorize('admin'), createDentist);

module.exports = router;