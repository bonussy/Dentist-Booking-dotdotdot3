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

//@desc     Add bookings by admin
//@route    POST /api/v1/admins/bookings
//@access   Private
exports.addBookingByAdmin = async (req, res, next) => {
    try {
        // Ensure admin is making the request
        if (req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: "Only admins can create bookings on behalf of users."
            });
        }

        const { user, dentist, date, status } = req.body;

        // Validate if both user and dentist are provided
        if (!user || !dentist) {
            return res.status(400).json({
                success: false,
                message: "Both user and dentist IDs must be provided."
            });
        }

        const dentistExists = await Dentist.findById(dentist);
        if (!dentistExists) {
            return res.status(404).json({
                success: false,
                message: `No dentist found with ID ${dentist}`
            });
        }

        // Check if the requested time conflicts with existing bookings
        const overlapBooking = await Booking.findOne({
            dentist,
            status: 'booked',
            date
        });

        if (overlapBooking) {
            return res.status(400).json({
                success: false,
                message: "The requested time overlaps with an existing booking for this dentist."
            });
        }

        // Create booking with the provided user and dentist details
        const booking = await Booking.create({ user, dentist, date, status });

        res.status(201).json({
            success: true,
            data: booking
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Cannot create Booking"
        });
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