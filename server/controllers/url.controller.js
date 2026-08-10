const { Queue } = require('bullmq');

const connection = require('../configs/bullmq');


//services imports
const { createShortURL, getOriginalURL } = require('../services/url.services');
const { addClickEvent } = require('../services/analytics.services');
const {enqueueClickEvent} = require('../services/analytics.services');


//controllers

const handleCreateShortURL = async (req, res, next) => {
    console.log("user sent a link");

    console.log("Url Sent is :", req.body.url);

    const url = req.body.url;
    const owner = req.body.owner;

    //before that i have to add basic validation.
    //thinking of using joi for input validation

    let shortCode;
    try {
        shortCode = await createShortURL(url,owner);
    } catch (error) {
        return next(error);
    }



    res.status(200).json({message : `http://localhost:3000/${shortCode}`});
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
    
    await enqueueClickEvent({
        urlId : originalURL._id,
        referer : req.get("Referer"),
        userAgent : req.get("User-Agent"),
        ip : req.ip
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

module.exports = {
    handleCreateShortURL,
    handleRedirect
};