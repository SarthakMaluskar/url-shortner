const { Queue } = require('bullmq');

const connection = require('../configs/bullmq');

//sryyyyyyyyyyyyyyy but i dont have the db layer yet, not optimal !!!
const URL = require('../models/URL');
const NotFoundError = require('../errors/NotFoundError');

//services imports
const { createShortURL, getOriginalURL, getMyUrls,deleteURL } = require('../services/url.services');
const { addClickEvent } = require('../services/analytics.services');
const { enqueueClickEvent } = require('../services/analytics.services');


//controllers

const handleCreateShortURL = async (req, res, next) => {
    console.log("user sent a link");

    console.log("Url Sent is :", req.body.url);

    const url = req.body.url;
    const owner = req.user.userId;
    const customAlias = req.body.custom ?? null;

    //before that i have to add basic validation.
    //thinking of using joi for input validation

    let shortCode;
    try {
        shortCode = await createShortURL(url, owner, customAlias);
    } catch (error) {
        return next(error);
    }



    res.status(200).json({ message: `http://localhost:3000/${shortCode}` });
}

const handleRedirect = async (req, res, next) => {
    //first check if code exists in db, if not throw an error invalid url
    //if code is present make a db lookup to get the original URL and then redirect

    const shortCode = req.params.code;

    //controller should not care weather original URL came from redis or db so redis should also be implemented in the service layer
    let originalURL;
    try {
        originalURL = await getOriginalURL(shortCode);
    } catch (error) {
        return next(error);
    }

    //13-07-26
    //lets first add the count event before the redirect happens for now


    //addClickEvent is in controller and not in getOriginalURL coz that is specifically for getting the urldoc, dont mix the concerns
    //now i have to remove addClickEvent from the controller and it to the worker, cause we will insert in just insert in queue here.

    //only doubt is should i include this logic in utils? like a function AddToQueue it is better right?
    console.log('enqueueing', originalURL._id.toString(), shortCode);

    await enqueueClickEvent({
        urlId: originalURL._id,
        referer: req.get("Referer"),
        userAgent: req.get("User-Agent"),
        ip: req.ip
    });


    //lets just commnet it out for now, this addClickEvent should be added in the worker file.

    // try {
    //     await addClickEvent(originalURL._id);
    // } catch (error) {
    //     return next(error);
    // }



    //no need for status code here, express automatically sends 302 for redirect
    return res.redirect(originalURL.originalURL);
}

const handleGetMyUrls = async (req, res, next) => {
    const userId = req.user.userId;



    try {
        const allUrls = await getMyUrls(userId);

        res.status(200).json({ data: allUrls });
    } catch (err) {
        next(err);
    }
};

const handleDeleteUrl = async (req, res, next) => {

    console.log(req.params.code);
    console.log(req.user.userId);

    try{
        await deleteURL(req.params.code, req.user.userId);
        res.status(200).json({message : "Deleted!"});
    
    }catch(err){
        next(err);
    }


    

}

module.exports = {
    handleCreateShortURL,
    handleRedirect,
    handleGetMyUrls,
    handleDeleteUrl
};