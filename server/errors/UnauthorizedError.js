const AppError = require('./AppError');

class UnauthorizedError extends AppError{
    constructor(message = "Not allowed"){
        super(message,401);
    }
}

module.exports = UnauthorizedError;