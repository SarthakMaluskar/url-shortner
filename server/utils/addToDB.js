const URL = require('../models/URL');

async function AddToDB(url, shortCode){
    //url is already validated also shortcode is unique so i can directly insert here

    const newURL = new URL({
        originalURL : url,
        shortCode
    })

    await newURL.save();
    console.log("URL :", url);
    console.log("ShortCode :", shortCode);
    
}

module.exports = AddToDB;