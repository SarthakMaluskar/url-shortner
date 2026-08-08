const bcrypt = require('bcrypt');

require('dotenv').config(); 

const jwt = require('jsonwebtoken');

const User = require('../models/User');

const ConflictError = require('../errors/ConflictError');
const BadRequest = require('../errors/BadRequest');
const UnauthorizedError = require('../errors/UnauthorizedError');

const secret = process.env.jwt_key;

const createUser = async (username, password) => {

    const saltRounds = 10;
    //have to hash the password before saving to db

    const userDoc = await User.findOne({ username: username });

    if (userDoc) {
        throw new ConflictError('Username already exists');
    }

    const hashed = await bcrypt.hash(password, saltRounds);

    const user = new User({
        username,
        password: hashed
    });

    await user.save();

    console.log(user);

    return user;

}

const loginUser = async (username, password) => {

    const user = await User.findOne({ username });
    if (!user) {
        throw new BadRequest("Invalid Username or Password");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new UnauthorizedError("Invalid Username or Password");
    }

    //have to add jwt here.

    const token = jwt.sign({
        userId : user.id
    }, secret, { expiresIn: '1h' });


    return {userId : user.id,username : user.username, token};

}

module.exports = { createUser, loginUser };