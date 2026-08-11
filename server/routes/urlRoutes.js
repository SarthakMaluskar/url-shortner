const express = require('express');
const Joi = require('joi');

//middlewares
const rateLimiter = require('../middlewares/rateLimiter');

const router = express.Router();

const urlValidatorSchema = require('../validators/urlValidator');

//auth middleware
const isAuthenticated = require('../middlewares/authMiddleware');

const {handleCreateShortURL, handleRedirect, handleGetMyUrls} = require('../controllers/url.controller');

const URL = require('../models/URL');


//auth middleware is required here.
router.post('/shorten',rateLimiter({bucketSize : 10, refillRate : 1}),isAuthenticated,handleCreateShortURL);

router.get('/my-urls', isAuthenticated,handleGetMyUrls);
//not here
router.get('/:code',rateLimiter({bucketSize : 100, refillRate : 20}) ,handleRedirect);




module.exports = router;