const { createUser, loginUser } = require('../services/auth.services');

const isProduction = process.env.NODE_ENV === 'production';

const getCookieOptions = () => ({
    httpOnly: true,
    maxAge: 60 * 60 * 1000,
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction ? true : false,
});

const handleSignup = async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        await createUser(username, password);
    } catch (err) {
        return next(err);
    }

    res.status(200).json({ message: "Registration Successfull!" });
};

const handleLogin = async (req, res, next) => {
    console.log("login route");

    const username = req.body.username;
    const password = req.body.password;

    try {
        const result = await loginUser(username, password);

        res.cookie('token', result.token, getCookieOptions());

        res.status(200).json({
            success: true,
            username: result.username,
            userId: result.userId,
        });
    } catch (err) {
        return next(err);
    }
};

const handleLogout = async (req, res, next) => {
    console.log("logout route");

    const clearOptions = {
        httpOnly: true,
        sameSite: isProduction ? 'none' : 'lax',
        secure: isProduction ? true : false,
    };

    res.clearCookie('token', clearOptions);

    return res.status(200).json({
        success: true,
        message: 'Logged out successfully',
    });
};

module.exports = {
    handleSignup,
    handleLogin,
    handleLogout,
};