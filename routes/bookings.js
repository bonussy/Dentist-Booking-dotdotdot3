const express = require('express');

const { getBookings, addBooking, updateBooking, deleteBooking } = require('../controllers/bookings');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router({mergeParams:true});

router.route('/')
    .get(protect, getBookings)
    .post(protect, authorize('admin','user'), addBooking);
router.route('/:id')
    .put(protect, authorize('admin','user'), updateBooking)
    .delete(protect, authorize('admin','user'), deleteBooking);

module.exports = router;