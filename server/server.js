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

// Trust proxy for secure cookies over reverse proxies (Render / Vercel / Nginx)
app.set('trust proxy', 1);

const allowedOrigins = [
    'http://localhost:5173',
    'https://url-shortner-lime-ten.vercel.app',
    process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, server-to-server)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(null, true); // Allow all configured SPA origins
        }
    },
    credentials: true,
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

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, ()=>{
            console.log(`Server running on port ${PORT}!`);
        })
    }catch(err){
        console.log("Failed to start the Server!");
        console.log(err.message);
    }
}

StartServer();
