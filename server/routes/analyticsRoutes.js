const express = require('express');
const URL = require('../models/URL');
const Click = require('../models/Click');

const {getAnalyticsController} = require('../controllers/analytics.controller');

const router = express.Router();

router.get('/analytics/:shortCode', getAnalyticsController);


module.exports = router;