const express = require('express');

const { getBookings, getBooking, createBooking, updateBooking, deleteBooking } = require('../controllers/bookings');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router({mergeParams:true});

router.route('/')
    .get(protect, authorize('user'),getBookings)
    .post(protect, authorize('user'), createBooking);
router.route('/:id')
    .get(protect,  authorize('user'), getBooking)
    .put(protect, authorize('user'), updateBooking)
    .delete(protect, authorize('user'), deleteBooking);

module.exports = router;