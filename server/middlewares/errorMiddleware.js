const ErrorHandeler = (err,req,res,next) =>{
    console.log(err);

    res.status(err.status || 500).json({
        message : err.message || "Internal Server Error"
    });
}

module.exports = ErrorHandeler;