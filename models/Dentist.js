const mongoose = require('mongoose');

const DentistSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    yearsOfExperience:{
        type: Number,
        required: [true, 'Please add years of experience']
    },
    areaOfExpertise:{
        type: String,
        required: [true, 'Please add an area of expertise'],
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

//Reverse populate with virtuals
DentistSchema.virtual('bookings',{
    ref: 'Booking',
    localField: '_id',
    foreignField: 'dentist',
    justOne: false
});

module.exports = mongoose.model('Dentist', DentistSchema);