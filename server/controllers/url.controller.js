


//services imports
const {createShortURL,getOriginalURL} = require('../services/url.services');
const {addClickEvent} = require('../services/analytics.services');


//controllers

const handleCreateShortURL = async (req,res,next) =>{
    console.log("user sent a link");

    console.log("Url Sent is :", req.body.url);

    const url = req.body.url;

    //before that i have to add basic validation.
    //thinking of using joi for input validation

    let shortCode;
    try{
        shortCode = await createShortURL(url);
    }catch(error){
       return next(error);
    }
   
    

    res.send(`http://localhost:3000/${shortCode}`);
}

const handleRedirect = async(req,res,next) =>{
    //first check if code exists in db, if not throw an error invalid url
    //if code is present make a db lookup to get the original URL and then redirect

    
    

    const shortCode = req.params.code;
    let originalURL;
    try{
        originalURL = await getOriginalURL(shortCode);
    }catch(error){
        return next(error);
    }

    //13-07-26
    //lets first add the count event before the redirect happens for now

    try{
        await addClickEvent(originalURL._id);
    }catch(error){
        return next(error);
    }

    

    //no need for status code here, express automatically sends 302 for redirect
    return res.redirect(originalURL.originalURL);
}

module.exports = {
    handleCreateShortURL,
    handleRedirect
};