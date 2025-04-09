const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    user:{
       type: mongoose.Schema.ObjectId,
       ref: 'User',
       required: true
    },
    dentist:{
        type: mongoose.Schema.ObjectId,
        ref: 'Dentist',
        required: true
    },
    date:{
       type: Date,
       required: true
    },
    status: { 
        type: String, 
        enum: ['booked', 'completed', 'canceled'], 
        default: 'booked' 
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Booking', BookingSchema);