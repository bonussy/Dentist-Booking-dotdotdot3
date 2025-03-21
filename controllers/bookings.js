const Booking = require('../models/Booking');

// @desc     Get all bookings
// @route    GET /api/v1/bookings
// @access   private
exports.getBookings = async (req,res,next) => {
    let query;

    //Registered user can see only their bookings!
    if(req.user.role !== 'admin'){
        query = Booking.find({user: req.user.id}).populate({
            path: 'dentist',
            select: 'name yearsOfExperience areaOfExpertise'
        });
    } else {
        query = Booking.find().populate({
            path: 'dentist',
            select: 'name yearsOfExperience areaOfExpertise'
        });
    }

    try{
        const bookings = await query;

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        })

    } catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Cannot find Booking"
        });
    }
};