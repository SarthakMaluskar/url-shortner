const bcrypt = require('bcrypt');

const User = require('../models/User');

const ConflictError = require('../errors/ConflictError');
const BadRequest = require('../errors/BadRequest');
const UnauthorizedError = require('../errors/UnauthorizedError');

const createUser = async (username, password) => {

    const saltRounds = 10;
    //have to hash the password before saving to db

    const userDoc = await User.findOne({username : username});

    if(userDoc){
        throw new ConflictError('Username already exists');
    }

    const hashed = await bcrypt.hash(password, saltRounds);

    const user =  new User({
        username,
        password: hashed
    });

    await user.save();

    console.log(user);
    
    return user;

}

const loginUser = async(username, password) => {

    const user = await User.findOne({username});
    if(!user){
        throw new BadRequest("User does not exist, Register please");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        throw new UnauthorizedError("Invalid Usename or Password");
    }
    
    //have to add jwt here.
    
    return user;

}

module.exports = {createUser, loginUser};