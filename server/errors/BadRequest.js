const AppError = require('./AppError');

class BadRequest extends AppError{
    constructor(message = "Bad Request"){
        super(message,400);
    }
}

module.exports = BadRequest;