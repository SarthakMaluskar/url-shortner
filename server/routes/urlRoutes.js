const express = require('express');
const Joi = require('joi');

const router = express.Router();
const urlValidatorSchema = require('../validators/urlValidator');
const CodeGen = require('../utils/shortCodeGen');



router.post('/link', (req, res) => {
    console.log("user sent a link");

    console.log("Url Sent is :", req.body.url);

    
    //before that i have to add basic validation.
    //thinking of using joi for input validation

    const {error, value} = urlValidatorSchema.validate({
        url: req.body.url
    })

    if(error){
        console.log(error.details[0].message);
        return res.send("wrong url");
    } 
    
    //now i have to first create a short code for that link & then save it in the db
    const shortCode = CodeGen();

    //here have to make a db lookup if code is already present if yes call codegen again (while loop)
    


})


module.exports = router;