
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const dateConverter = require('../utils/dateConverter');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '24h'
    });
};

const signup = async (req, res) => {

    const { username, email, password } = req.body;

    const usernameAlreadyExists = await User.findOne({ username });
    const emailAlreadyExists = await User.findOne({ email });

    if(usernameAlreadyExists){
        return res.status(401).json({ error: "Username Already Exists!" });
    }

    if(emailAlreadyExists){
        return res.status(401).json({ error: "Email Already Exists!" });
    }

    const salt = await bcrypt.genSalt(10);

    const hashed = await bcrypt.hash(password, salt);

    const verificationToken = crypto.randomBytes(20).toString('hex');

    const user = new User({
        username, 
        email, 
        password : hashed, 
        imgUrl: process.env.DEFAULT_USER_IMAGE,
        emailVerificationToken: crypto.createHash('sha256').update(verificationToken).digest('hex'),
        emailVerificationExpire: Date.now() + (24 * 60 * 60 * 1000)
    });

    await user.save();

    const verificationUrl = `${process.env.CLIENT_DOMAIN}/auth/email-verification?token=${verificationToken}`;

    const message = `
        <h2> Thank You for registering with us! </h2>
        <p> Please click the below button to verify your email </p>
        <button> <a href=${verificationUrl} clicktracking=off> Verify Email </a> </button>
    `;

    await sendEmail({
        to: email,
        subject: 'Email Verification',
        html: message
    });

    console.log('Email Sent');

    res.status(200).json({ 
        "message" : "Successfully Registered. Please check your email for account verification"
    });

};

const emailVerification = async (req, res) => {

    const { token } = req.query;

    const emailVerificationToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        emailVerificationToken,
        emailVerificationExpire: { $gt: Date.now() }
    });

    if(!user){
        return res.status(404).json({ error: 'Invalid token' });
    }

    user.onboarded = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;

    await user.save();

    const recipesUrl = `${process.env.CLIENT_DOMAIN}`;

    const message = `
        <h2> Welcome to Recipevibe! </h2>
        <p> Have a look at our recipes <a href=${recipesUrl}>here</a>. </p>
    `;

    await sendEmail({
        to: user.email,
        subject: 'Welcome',
        html: message
    });

    console.log('Email Sent');

    res.status(200).json({ 
        "message" : "Email verified successfully"
    });

};

const signin = async (req, res) => {

    const { usernameOrEmail, password } = req.body;

    const usernameExists = await User.findOne({ username : usernameOrEmail });
    const emailExists = await User.findOne({ email : usernameOrEmail });

    if(!usernameExists && !emailExists){
        return res.status(404).json({ error: "Username or Email not found!" });
    }

    let user;
    let hashPassword;

    if(usernameExists){
        user = usernameExists;
        if(!usernameExists.onboarded){
            return res.status(401).json({ error: 'Please Verify your Email first' });
        }
        hashPassword = usernameExists.password;
    }
    if(emailExists){
        user = emailExists;
        if(!emailExists.onboarded){
            return res.status(401).json({ error: 'Please Verify your Email first' });
        }
        hashPassword = emailExists.password;
    }

    const auth = await bcrypt.compare(password, hashPassword);
    if(!auth){
        return res.status(401).json({ error: "Incorrect Password!" });
    }

    const token = generateToken(user._id);

    // user._id = undefined;
    user.password = undefined;

    const resetUrl = `${process.env.CLIENT_DOMAIN}/auth/forgot-password`;

    const message = `
        <p> A new login was detected at ${dateConverter(Date.now())}. If it's you, safely ignore this message otherwise immediately change your password <a href=${resetUrl}>here</a>. </p>
    `;

    await sendEmail({
        to: user.email,
        subject: 'New Login Detected',
        html: message
    });

    res.status(200).json({ 
        message: "Signedin successful",
        token, 
        user 
    });
    
};

const forgotPassword = async (req, res) => {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if(!user){
        return res.status(404).json({ error: 'Email not found' });
    }

    const resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetPasswordToken).digest('hex');
    user.resetPasswordExpire = Date.now() + (10 * 60 * 1000);

    await user.save();

    const resetPasswordUrl = `${process.env.CLIENT_DOMAIN}/auth/reset-password?token=${resetPasswordToken}`;

    const message = `
        <h2> You requested a password reset </h2>
        <h2> Click on this button to reset your password </h2>
        <button> <a href=${resetPasswordUrl}> Reset Password </a> </button> 
        <p> This link is valid for only 10 mins, after that it will expire. </p> 
    `;

    await sendEmail({
        to : email,
        subject : "Password Reset",
        html : message
    });
     
    res.status(200).json({
        "message" : "Email Sent"
    });

};

const resetPassword = async (req, res) => {
    
    const { password } = req.body;

    const { resetToken } = req.query;

    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if(!user){
        return res.status(401).json({ error: 'Invalid token' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    user.password = hashed;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
        "message" : "Password Updated Successfully"
    });

};

const updateUser = async (req, res) => {

    const { username, recipeId } = req.body;

    const user = await User.findOne({ _id: req.user._id });

    if(username && (username !== user.username)){
        const usernameExists = await User.findOne({ username });
        if(usernameExists){
            return res.status(401).json({ error: 'This username already exists' });
        } 
        user.username = username;
    }

    if(recipeId && !user.bookmarks.includes(recipeId)){
        user.bookmarks.push(recipeId);
    }

    await user.save();

    res.status(201).json({
        message: 'Successfully updated',
        user
    });
    
};

module.exports = {
    signup,
    signin,
    emailVerification,
    forgotPassword,
    resetPassword,
    updateUser
};