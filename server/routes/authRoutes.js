const express = require('express');

const User = require('../models/User');

const {handleSignup, handleLogin,handleLogout} = require('../controllers/auth.controller');

const router = express.Router();

//signup route

router.post('/signup', handleSignup);


//login route
router.post('/login', handleLogin);

router.post('/logout', handleLogout);

module.exports = router;