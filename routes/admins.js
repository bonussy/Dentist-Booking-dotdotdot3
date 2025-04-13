const express = require('express');

const { getBookingsByAdmin, updateBookingByAdmin, deleteBookingByAdmin, getBookingByAdmin } = require('../controllers/admins');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router({mergeParams:true});

router.route('/')
    .get(protect,authorize('admin'), getBookingsByAdmin)
router.route('/:id')
    .get(protect, authorize('admin'),getBookingByAdmin)
    .put(protect,authorize('admin'),updateBookingByAdmin)
    .delete(protect,authorize('admin'),deleteBookingByAdmin);
module.exports = router;