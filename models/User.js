const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email:{
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
            'Please add a valid email'
        ]
    },
    password:{
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    telephone:{
        type: String,
        required: [true, 'Please add a telephone number'],
        unique: true,
        match: [
            /^(\+?234|0)[789][01]\d{8}$/,
            'Please add a valid telephone number'
        ]
    },
    role:{
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);