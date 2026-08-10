const Click = require('../models/Click');
const URL = require('../models/URL');

//errors
const InternalServerError = require('../errors/InternalServerError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const analyticsQueue = require('../queues/analytics.queue');

const addClickEvent = async (analyticsDoc) => {

    // urlId: originalURL._id,
    // referer : req.get("Referer"),
    // userAgent : req.get("User-Agent")

    console.log("reached addClickEvent");

    try {
        const click = new Click({
            url: analyticsDoc.urlId,
            userAgent: analyticsDoc.userAgent,
            referer: analyticsDoc.referer,
            ip: analyticsDoc.ip
        })
        
        await click.save();
        

    } catch (error) {
        throw new InternalServerError("failed while adding cilck doc");
    }

}


const getAnalytics = async (shortCode,userId) => {


    //got the original URL document
    const urlDoc = await URL.findOne({ shortCode });

    //have to check if the owner ID in url document matches with the one who is authenticated
    //if not he is trying to access others analytics

    if (!urlDoc) {
        throw new NotFoundError("shortCode not found");
    }

    if(urlDoc.owner.toString() !== userId){
        throw new UnauthorizedError("You are not allowed to access this analytics");
    }


    const docId = urlDoc._id;

    //this gets the total docs with url : docId in the Clicks Model
    const totalClicks = await Click.countDocuments({ url: docId });

    //this gets clicked in last 24 hours
    const last24hours = await Click.countDocuments({ url: docId, clickedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } });

    //this gets the last clicked
    const latestClickDoc = await Click.findOne({ url: docId }).sort({ _id: -1 });

    const uniqueVisitors = await Click.distinct('ip', { url: docId });

    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 4);
    fiveDaysAgo.setHours(0, 0, 0, 0);

    const clicksPerDay = await Click.aggregate([
        {
            $match: { url: docId,
                clickedAt : {
                    $gte : fiveDaysAgo
                }
             }
        },
        {
            $group: {
                _id: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$clickedAt"
                    }
                },
                totalClicks: {
                    $sum: 1
                }
            }
        },
        {
            $sort: {
                _id: -1
            }
        }
    ]);

    //lets write top 5 referrers 

    const topReferrers = await Click.aggregate([
        {
            $match : {
                url : docId,
                referer : {
                    $ne : null
                }
                
            }
        },
        {
            $group : {
                _id : "$referer",
                count : {$sum : 1}
            }
        },
        {
            $sort : { count : -1}
        },
        {
            $limit : 5
        }
    ])


    return {
        "shortCode": urlDoc.shortCode,
        "originalURL": urlDoc.originalURL,
        "totalClicks": totalClicks,
        lastClickedAt: latestClickDoc?.clickedAt ?? null,
        "clicksLast24Hours": last24hours,
        "createdAt": urlDoc.createdAt,
        "uniqueVisitors": uniqueVisitors.length,
        "clicksPerDay" : clicksPerDay,
        "topReferrers" : topReferrers
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