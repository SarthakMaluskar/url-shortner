const Click = require('../models/Click');
const URL = require('../models/URL');

const addClickEvent = async (urlID) => {


    try {
        const click = new Click({
            url: urlID
        })

        await click.save();
        
    }catch(error){
        console.log(error);
        const err = new Error("Database Error : failed while adding cilck doc");
        err.status = 400;
        throw err;
    }
   
}


const getAnalytics = async(shortCode) =>{

     const urlDoc = await URL.findOne({shortCode});
    
        if(!urlDoc){
           const err = new Error("shortCode Not Found!");
           err.status = 404;
           throw err;
        }
    
        const docId = urlDoc._id;
        
        const totalClicks = await Click.countDocuments({url : docId});
    
        return {
            "shortCode" : urlDoc.shortCode,
            "originalURL" : urlDoc.originalURL,
            "totalClicks" : totalClicks
        };
}


module.exports = {
    addClickEvent,
    getAnalytics
}