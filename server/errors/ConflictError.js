const AppError = require('./AppError');

class ConflictError extends AppError{
    constructor(message = "Conflict with existing data"){
        super(message,409);
    }
}

module.exports = ConflictError;