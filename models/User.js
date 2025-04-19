const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'], // Validation: Name is required
        unique: true, // Validation: Name must be unique
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters'] // Validation: Max length of 50 characters
    },
    telephone: {
        type: String,
        required: [true, 'Please add a telephone number'], // Validation: Telephone is required
        unique: true, // Validation: Telephone must be unique
        match: [
            /^(\+66|0)[689]\d{8}$/, // Validation: Must match the Thai phone number format
            'Please add a valid telephone number'
        ]
    },
    email: {
        type: String,
        required: [true, 'Please add an email'], // Validation: Email is required
        unique: true, // Validation: Email must be unique
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\0-9]+\.)+[a-zA-Z]{2,}))$/, // Validation: Must match email format
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'], // Validation: Password is required
        minlength: 6, // Validation: Minimum length of 6 characters
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Validation: Role must be either 'user' or 'admin'
        default: 'user'
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
}

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

module.exports = mongoose.model('User', UserSchema);