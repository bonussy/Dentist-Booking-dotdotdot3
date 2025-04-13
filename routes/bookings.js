const express = require('express');

const { getBookings, addBooking, updateBooking, deleteBooking } = require('../controllers/bookings');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router({mergeParams:true});

router.route('/')
    .get(protect, authorize('user'),getBookings)
    .post(protect, authorize('user'), addBooking);
router.route('/:id')
    .put(protect, authorize('user'), updateBooking)
    .delete(protect, authorize('user'), deleteBooking);

module.exports = router;