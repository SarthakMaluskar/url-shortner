const Click = require('../models/Click');
const URL = require('../models/URL');

//errors
const InternalServerError = require('../errors/InternalServerError');
const NotFoundError = require('../errors/NotFoundError');

const addClickEvent = async (urlID) => {


    try {
        const click = new Click({
            url: urlID
        })

        await click.save();

    } catch (error) {
        throw new InternalServerError("failed while adding cilck doc");
    }

}


const getAnalytics = async (shortCode) => {


    //got the original URL document
    const urlDoc = await URL.findOne({ shortCode });

    if (!urlDoc) {
        throw new NotFoundError("shortCode not found");
    }

    
    const docId = urlDoc._id;

    //this gets the total docs with url : docId in the Clicks Model
    const totalClicks = await Click.countDocuments({ url: docId });

    //this gets clicked in last 24 hours
    const last24hours = await Click.countDocuments({url : docId, clickedAt : { $gte : new Date(Date.now() - 24*60*60*1000)}});

    //this gets the last clicked
    const latestClickDoc = await Click.findOne({url: docId}).sort({_id:-1});



    return {
        "shortCode": urlDoc.shortCode,
        "originalURL": urlDoc.originalURL,
        "totalClicks": totalClicks,
        "lastClick" : latestClickDoc.clickedAt?? null,
        "last24Hours" : last24hours,
        "createdAt": urlDoc.createdAt
    };
}


module.exports = {
    addClickEvent,
    getAnalytics
}