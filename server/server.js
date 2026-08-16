const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

require('dotenv').config(); 

//configs
const StartDB = require('./configs/db.js');
const redisClient = require('./configs/redis.js');

//routes
const testRoute = require('./routes/testAPI.js');
const urlRoutes = require('./routes/urlRoutes.js');
const analyticsRoutes = require('./routes/analyticsRoutes.js');
const authRoutes = require('./routes/authRoutes.js');

//middlewares
const ErrorHandeler = require('./middlewares/errorMiddleware.js');

const app = express();

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://url-shortner-lime-ten.vercel.app/'
    ],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/', testRoute);
app.use('/', urlRoutes);
app.use('/', analyticsRoutes);
app.use('/', authRoutes);






app.use(ErrorHandeler);
async function StartServer(){
    try{
        await StartDB();
        
        await redisClient.connect();
        console.log("Redis connected!")

        require("./workers/analytics.worker");

        app.listen(3000, ()=>{
            console.log("Server running on port 3000!");
        })
    }catch(err){
        console.log("Failed to start the Server!");
        console.log(err.message);
    }
}



StartServer();

