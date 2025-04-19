const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    dentist: {
        type: mongoose.Schema.ObjectId,
        ref: 'Dentist',
        required: true
    },
    date: {
        type: Date,
        required: true,
        // validate: {
        //     validator: function (value) {
        //         // Ensure the date has no minutes or seconds (only hours)
        //         return value.getMinutes() === 0 && value.getSeconds() === 0;
        //     },
        //     message: 'Booking time must be on the hour (e.g., 14:00, 15:00).'
        // }
    },
    status: {
        type: String,
        enum: ['booked', 'completed', 'canceled'],
        default: 'booked'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Booking', BookingSchema);