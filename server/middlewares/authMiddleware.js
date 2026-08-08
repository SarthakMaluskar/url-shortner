const jwt = require('jsonwebtoken');
const secret = process.env.jwt_key;

const isAuthenticated = async (req, res, next) => {

    try {
        const token = req.cookies.token;

        if(!token){
            return res.status(401).json({message : "Not authenticated"});
        }
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();

    }catch(err){
        return res.status(401).json({message : "Invalid or Expired token"});
    }

}


module.exports = isAuthenticated;