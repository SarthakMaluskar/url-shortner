const express = require('express');
const Joi = require('joi');

const router = express.Router();

const urlValidatorSchema = require('../validators/urlValidator');

const CodeGen = require('../utils/shortCodeGen');
const AddToDB = require('../utils/addToDB');

const URL = require('../models/URL');



router.post('/shorten', async(req, res) => {
    console.log("user sent a link");

    console.log("Url Sent is :", req.body.url);

    const url = req.body.url;
    
    //before that i have to add basic validation.
    //thinking of using joi for input validation

    const {error, value} = urlValidatorSchema.validate({
        url
    })

    if(error){
        console.log(error.details[0].message);
        return res.send("wrong url");
    } 
    
    //now i have to first create a short code for that link & then save it in the db
    

    //here have to make a db lookup if code is already present if yes call codegen again (while loop)
    let shortCode;

    do{
        shortCode = CodeGen();
    }while(await URL.exists({shortCode}))

    //now i have the shortCode now i have to insert it into the DB
    try{
        await AddToDB(url, shortCode);
    }catch(err){
        console.log("error while adding to DB");
    }
    
    res.send(`https://localhost:3000/${shortCode}`);


})


module.exports = router;