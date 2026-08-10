const mongoose = require('mongoose');
const User = require('../models/User');

const Schema = mongoose.Schema;

const urlSchema = Schema({
    originalURL : {
        type : String,
        required : true,
    },
    shortCode : {
        type : String,
        required : true,
        unique : true
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    }
}, {timestamps : true});

const URL = mongoose.model('URL', urlSchema);

module.exports = URL;