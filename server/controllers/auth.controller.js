const {createUser, loginUser} = require('../services/auth.services');

const handleSignup = async(req,res,next) => {
    
    const username = req.body.username;
    const password = req.body.username;
    
    try{
        await createUser(username, password);
    }catch(err){
        return next(err);
    }
    

    res.status(200).json({message : "Registration Successfull!"});
} 

const handleLogin = async(req,res,next) => {
    console.log("login route");

    const username = req.body.username;
    const password = req.body.password;

    
    try{
        const result = await loginUser(username, password);

        res.cookie('token', result.token, {
        httpOnly : true,
        maxAge: 60 * 60 * 1000,
        sameSite: 'strict'
    })

    res.status(200).json({success : true, username : result.username, userId : result.userId});

    }catch(err){
        return next(err);
    }
    
}


module.exports = {
    handleSignup,
    handleLogin
};