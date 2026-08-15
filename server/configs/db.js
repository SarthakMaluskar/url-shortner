const mongoose = require('mongoose');

async function StartDB(){

    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database Connected!");
    }catch(err){
        console.log("DB connection failed!");
        console.error(err.message);
    }
   
}

module.exports = StartDB;