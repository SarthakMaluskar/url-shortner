const express = require('express');
const Joi = require('joi');

//middlewares
const rateLimiter = require('../middlewares/rateLimiter');

const router = express.Router();

const urlValidatorSchema = require('../validators/urlValidator');


const {handleCreateShortURL, handleRedirect} = require('../controllers/url.controller');

const URL = require('../models/URL');



router.post('/shorten',rateLimiter({bucketSize : 10, refillRate : 1}) ,handleCreateShortURL);


router.get('/:code',rateLimiter({bucketSize : 100, refillRate : 20}) ,handleRedirect);


module.exports = router;