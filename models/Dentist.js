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
});

module.exports = mongoose.model('Dentist', DentistSchema);