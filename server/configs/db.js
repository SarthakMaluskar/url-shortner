const mongoose = require('mongoose');

async function StartDB(){

    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/url-shortner');
        console.log("Database Connected!");
    }catch(err){
        console.log("DB connection failed!");
        console.error(err.message);
    }
   
}

module.exports = StartDB;