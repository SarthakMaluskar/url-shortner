const mongoose = require('mongoose');
const URL = require('../models/URL');

const Schema = mongoose.Schema;

//this schema is okay for now
const ClickSchema = Schema({
    url : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'URL',
        required : true,
        index : true
    },
    clickedAt : {
        type : Date,
        default : Date.now
    }
})

const Click = mongoose.model('Click', ClickSchema);

module.exports = Click;