const urlValidatorSchema = require('../validators/urlValidator');

//Errors
const BadRequest = require('../errors/BadRequest');
const InternalServerError = require('../errors/InternalServerError');
const NotFoundError = require('../errors/NotFoundError');

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
        throw new BadRequest("Invalid Link");
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
        throw new InternalServerError("Error while writing Link in DB");
    }

    return shortCode;
}

const getOriginalURL = async (shortCode) => {

    let urlDoc;

    try {
        urlDoc = await URL.findOne({ shortCode });
    } catch (error) {
        throw new InternalServerError("DB error while fetching URL doc");
    }

    if (!urlDoc) {
        throw new NotFoundError("URL with this ShortCode does not exist");
    }


    console.log(urlDoc.shortCode, ": redirecting to :", urlDoc.originalURL);

    return urlDoc;
}





module.exports = {
    createShortURL,
    getOriginalURL,
}