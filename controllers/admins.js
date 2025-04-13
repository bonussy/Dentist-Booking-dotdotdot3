const Booking = require('../models/Booking');

// @desc     Get all bookings
// @route    Get /api/v1/admins/bookings
// @access   Private
exports.getBookingsByAdmin = async (req, res, next) => {
    let query = Booking.find().populate({
        path: 'dentist',
        select: 'name yearsOfExperience areaOfExpertise'
    });

    try {
        const bookings = await query;

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Cannot find Booking"
        });
    }
};

//@desc     Get single booking
//@route    GET /api/v1/admins/booking/:id
//@access   Private
exports.getBookingByAdmin = async(req, res, next) => {
    try{
        const booking = await Booking.findById(req.params.id);

        if (!booking){
            return res.status(404).json({
                success: false,
                message: `No booking found with id ${req.params.id}`
            });
        }

        res.status(200).json({success:true,data:booking});
    }catch(err){
        res.status(400).json({success:false});
    }
    
};


//@desc     Update booking
//@route    PUT /api/v1/admins/bookings/:id
//@access   Private
exports.updateBookingByAdmin = async (req, res, next) => {
    try {
        let booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: `No booking found with id ${req.params.id}`
            });
        }

        // Ensure admin is authorized to update
        if (req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to update this booking`
            });
        }

        booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Cannot update Booking"
        });
    }
};


//@desc     Delete booking
//@route    DELETE /api/v1/admins/bookings/:id
//@access   Private
exports.deleteBookingByAdmin = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: `No booking found with id ${req.params.id}`
            });
        }

        // Ensure admin is authorized to delete
        if (req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to delete this booking`
            });
        }

        await booking.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Cannot delete Booking"
        });
    }
};