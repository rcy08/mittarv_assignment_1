
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    imgUrl: {
        type: String
    },
    onboarded: {
        type: Boolean,
        default: false
    },
    bookmarks: [
        {
            type: String,
        }
    ],
    emailVerificationToken: String,
    emailVerificationExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;