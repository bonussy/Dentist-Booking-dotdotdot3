const Booking = require('../models/Booking');
const Dentist = require('../models/Dentist');
const mongoose = require('mongoose');

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

//@desc     Add bookings
//@route    POST /api/v1/dentists/:dentistId/bookings
//@acess    private
exports.addBooking = async (req,res,next) => {
    try{
        req.body.dentist = req.params.dentistId;

        const dentist = await Dentist.findById(req.params.dentistId);

        if(!dentist){
            return res.status(404).json({
                success: false,
                message: `NO dentist with the id of ${req.params.dentistId}`
            });
        }

        //add user Id to req.body
        req.body.user = req.user.id;

        //Check for existed booking
        const existedBookings = await Booking.find({user: req.user.id, status:'booked'});
        
        //If the user is not an admin, they can only book 1 booking
        if(existedBookings.length > 0 && req.user.role !== 'admin'){
            return res.status(400).json({
                success: false,
                message: `You had already made 1 booking`
            });
        }

        //User can't not book overlap booking with the same dentist
        //date format: 2025-04-01T14:00:00.000+00:00

        const overlapBooking = await Booking.findOne({
            dentist: req.params.dentistId,
            status: 'booked',
            date: req.body.date
        });

        if(overlapBooking) {
            return res.status(400).json({
                success: false,
                message: 'The requested time overlaps with an existing booking for this dentist.'
            })
        }

        //Create Booking
        const booking = await Booking.create(req.body);

        res.status(200).json({
            success: true,
            data: booking
        })

    } catch(err) {
        // Handle validation errors
        if (err.name === 'ValidationError') {
            console.log(`Validation Error: ${err.message}`);
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }

        // Log unexpected errors
        console.log(err);
        return res.status(500).json({
            success: false,
            message: 'Cannot create Booking'
        });
    }
};

//@desc     Update booking
//@route    PUT /api/v1/bookings/:id
//@access   private
exports.updateBooking = async (req,res,next) => {
    try{
        let booking = await Booking.findById(req.params.id);

        if(!booking){
            return res.status(404).json({
                success: false,
                message: `NO booking with the id of ${req.params.id}`
            });
        }

        console.log(booking.user.toString());
        console.log(req.user.id);

        //Make sure user is the appointment owner
        if(booking.user.toString() !== req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to update this appointment`
            });
        }

        booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: booking
        })

    } catch(err) {
        // Handle validation errors
        if (err.name === 'ValidationError') {
            console.log(`Validation Error: ${err.message}`);
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }

        // Log unexpected errors
        console.log(err);
        return res.status(500).json({
            success: false,
            message: 'Cannot create Booking'
        });

    }
}

//@desc     Delete booking
//@route    DELETE /api/v1/bookings/:id
//@access   private
exports.deleteBooking = async (req,res,next) => {
    try{
        const booking = await Booking.findById(req.params.id);

        if(!booking){
            return res.status(404).json({
                success: false,
                message: `NO booking with the id of ${req.params.id}`
            });
        }

        //Make sure user is the appointment owner
        if(booking.user.toString() !== req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to delete this appointment`
            });
        }

        await booking.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        })
        

    } catch(err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: 'Cannot delete Booking'
        });
    }
}