const mongoose = require('mongoose');

async function StartDB(){
    await mongoose.connect('mongodb://127.0.0.1:27017/url-shortner');
}
 

StartDB();

const URL = require('../models/URL');
const ShortCodeGen = require('./shortCodeGen');

async function AddToDB(url, shortCode ){
    const newURL = new URL({
        originalURL : url,
        shortCode
    })

    await newURL.save();
}

async function UrlSeed(){
    const urls = ["https://google.com", "https://github.com/SarthakMaluskar"];

    for(const url of urls){
        const shortCode = ShortCodeGen();
        await AddToDB(url, shortCode);
    }
    
    await mongoose.disconnect();

    return;

}

UrlSeed();
