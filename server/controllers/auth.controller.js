const { createUser, loginUser } = require('../services/auth.services');

/**
 * Returns environment and protocol-aware cookie options
 * @param {import('express').Request} req 
 */
const getCookieOptions = (req) => {
    // Detect whether connection/environment is HTTPS or Production
    const isHttps = 
        req.secure || 
        req.headers['x-forwarded-proto'] === 'https' ||
        process.env.NODE_ENV === 'production' ||
        process.env.RENDER === 'true' ||
        (req.headers.origin && req.headers.origin.startsWith('https://'));

    return {
        httpOnly: true,
        maxAge: 60 * 60 * 1000, // 1 hour
        sameSite: isHttps ? 'none' : 'lax',
        secure: isHttps,
        path: '/',
    };
};

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
    console.log("login route called from origin:", req.headers.origin);

    const username = req.body.username;
    const password = req.body.password;

    try {
        const result = await loginUser(username, password);

        const cookieOptions = getCookieOptions(req);
        console.log("Setting token cookie with options:", cookieOptions);

        res.cookie('token', result.token, cookieOptions);

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

    const cookieOptions = getCookieOptions(req);

    res.clearCookie('token', {
        httpOnly: true,
        sameSite: cookieOptions.sameSite,
        secure: cookieOptions.secure,
        path: '/',
    });

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