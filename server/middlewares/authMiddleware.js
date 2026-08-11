const jwt = require('jsonwebtoken');
const secret = process.env.jwt_key;

const isAuthenticated = async (req, res, next) => {
    try {
        console.log('cookies:', req.cookies);

        const token = req.cookies.token;


        const decoded = jwt.verify(token, secret);

        // const token = jwt.sign({
        //     userId: user.id
        // }, secret, { expiresIn: '1h' });

        req.user = decoded;
        next();

    } catch (err) {
        console.error('JWT ERROR =>', err);
        return res.status(401).json({
            message: err.message
        });
    }
};

module.exports = isAuthenticated;