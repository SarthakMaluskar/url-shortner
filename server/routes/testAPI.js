const express = require('express');

const router = express.Router();

router.get('/test', (req,res)=>{
    console.log("GET /test");
    res.send('Test API');
})


module.exports = router;