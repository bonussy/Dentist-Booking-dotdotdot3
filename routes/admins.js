const express = require('express');

const { getBookingsByAdmin, updateBookingByAdmin, deleteBookingByAdmin } = require('../controllers/admins');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router({mergeParams:true});

router.route('/')
    .get(protect,authorize('admin'), getBookingsByAdmin)
router.route('/:id')
    .put(protect,authorize('admin'),updateBookingByAdmin)
    .delete(protect,authorize('admin'),deleteBookingByAdmin);
module.exports = router;