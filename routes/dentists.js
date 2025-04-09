const express = require('express');
const { getDentists } = require('../controllers/dentists');

const router = express.Router();

//Include other resource routers
const bookingRouter = require('./bookings');

//Re-route into other resource routers
router.use('/:dentistId/bookings/', bookingRouter);

router.route('/').get(getDentists);

module.exports = router;