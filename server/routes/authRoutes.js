const express = require('express');
const router = express.Router();

const { 
    signup, 
    signin, 
    emailVerification, 
    forgotPassword,
    resetPassword,
    updateUser
} = require('../controllers/authController');

const { auth } = require('../middlewares/auth');

router.post('/signup', signup);

router.post('/signin', signin);

router.post('/forgot-password', forgotPassword);

router.post('/email-verification', emailVerification);

router.post('/reset-password', resetPassword);

router.post('/update-user', auth, updateUser);

module.exports = router;