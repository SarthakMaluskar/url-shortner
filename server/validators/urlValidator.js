const Joi = require('joi');

const urlValidatorSchema = Joi.object({
    url : Joi.string().uri()
})



module.exports = urlValidatorSchema;