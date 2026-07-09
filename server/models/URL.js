const mongoose = require('mongoose');

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
    }
}, {timestamps : true});

const URL = mongoose.model('URL', urlSchema);

module.exports = URL;