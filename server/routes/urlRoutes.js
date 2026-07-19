const express = require('express');
const Joi = require('joi');

const router = express.Router();

const urlValidatorSchema = require('../validators/urlValidator');


const {handleCreateShortURL, handleRedirect} = require('../controllers/url.controller');

const URL = require('../models/URL');



router.post('/shorten', handleCreateShortURL);


router.get('/:code', handleRedirect);


module.exports = router;