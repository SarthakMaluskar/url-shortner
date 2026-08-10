const express = require('express');
const URL = require('../models/URL');
const Click = require('../models/Click');

const isAuthenticated = require('../middlewares/authMiddleware');

const rateLimiter = require('../middlewares/rateLimiter');

const {getAnalyticsController} = require('../controllers/analytics.controller');

const router = express.Router();

router.get('/analytics/:shortCode',rateLimiter({bucketSize : 20, refillRate : 2}),isAuthenticated ,getAnalyticsController);


module.exports = router;