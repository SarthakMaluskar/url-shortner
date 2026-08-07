const express = require('express');

const User = require('../models/User');

const {handleSignup, handleLogin} = require('../controllers/auth.controller');

const router = express.Router();

//signup route

router.post('/signup', handleSignup);


//login route
router.post('/login', handleLogin);

module.exports = router;