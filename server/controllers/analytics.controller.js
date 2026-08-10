

//service imports
const {getAnalytics} = require('../services/analytics.services');


const getAnalyticsController = async(req,res,next) =>{

    const shortCode = req.params.shortCode;
    const userId = req.user.userId;

    console.log(userId);

    //lets get the original url document and get its id
    let analytics;
    try{
        analytics = await getAnalytics(shortCode,userId);
    }catch(error){
        return next(error);
    }
    

    res.json(analytics);

}

module.exports = {
    getAnalyticsController
}