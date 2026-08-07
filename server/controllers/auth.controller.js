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
        await loginUser(username, password);
    }catch(err){
        return next(err);
    }
    

    res.send(`Login done! ${username}`);
}


module.exports = {
    handleSignup,
    handleLogin
};