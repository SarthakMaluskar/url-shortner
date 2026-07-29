const Click = require('../models/Click');
const URL = require('../models/URL');

//errors
const InternalServerError = require('../errors/InternalServerError');
const NotFoundError = require('../errors/NotFoundError');

const analyticsQueue = require('../queues/analytics.queue');

const addClickEvent = async (analyticsDoc) => {

    // urlId: originalURL._id,
    // referer : req.get("Referer"),
    // userAgent : req.get("User-Agent")

    try {
        const click = new Click({
            url: analyticsDoc.urlId,
            userAgent : analyticsDoc.userAgent,
            referer : analyticsDoc.referer,
            ip : analyticsDoc.ip
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
    const last24hours = await Click.countDocuments({ url: docId, clickedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } });

    //this gets the last clicked
    const latestClickDoc = await Click.findOne({ url: docId }).sort({ _id: -1 });

    const uniqueVisitors = await Click.distinct('ip', {url : docId});


    return {
        "shortCode": urlDoc.shortCode,
        "originalURL": urlDoc.originalURL,
        "totalClicks": totalClicks,
        "lastClickedAt": latestClickDoc.clickedAt ?? null,
        "clicksLast24Hours": last24hours,
        "createdAt": urlDoc.createdAt,
        "uniqueVisitors" : uniqueVisitors.length
    };
}


const enqueueClickEvent = async (data) => {
    await analyticsQueue.add('record-click', data, {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000
        }
    });
}


module.exports = {
    addClickEvent,
    getAnalytics,
    enqueueClickEvent
}