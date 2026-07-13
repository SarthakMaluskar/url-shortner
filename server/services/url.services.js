const urlValidatorSchema = require('../validators/urlValidator');

//models
const URL = require('../models/URL');
const Click = require('../models/Click');


//utils
const CodeGen = require('../utils/shortCodeGen');
const AddToDB = require('../utils/addToDB');


//service functions
const createShortURL = async (url) => {
    const { error, value } = urlValidatorSchema.validate({
        url
    })

    //using joi sanitized value
    url = value.url;

    if (error) {
        console.log(error.details[0].message);
        //invalid link
        const err = new Error("Invalid Link");
        err.status = 400; //bad request
        throw err;
    }

    //now i have to first create a short code for that link & then save it in the db


    //here have to make a db lookup if code is already present if yes call codegen again (while loop)
    let shortCode;

    do {
        shortCode = CodeGen();
    } while (await URL.exists({ shortCode }))

    //now i have the shortCode now i have to insert it into the DB
    try {
        await AddToDB(url, shortCode);
    } catch (error) {
        console.log("error while adding to DB");
        const err = new Error("Database Error");
        err.status = 500;
        throw err;
    }

    return shortCode;
}

const getOriginalURL = async (shortCode) => {

    let urlDoc;

    try {
        urlDoc = await URL.findOne({ shortCode });
    } catch (error) {
        console.log(error);
        const err = new Error("Internal Server Error");
        err.status = 500;
        throw err;
    }

    if (!urlDoc) {
        const err = new Error("URL does not exist");
        err.status = 404;
        throw err;
    }


    console.log(urlDoc.shortCode, ": redirecting to :", urlDoc.originalURL);

    return urlDoc;
}





module.exports = {
    createShortURL,
    getOriginalURL,
}