const express = require('express');
const StartDB = require('./configs/db.js');
const testRoute = require('./routes/testAPI.js');
const urlRoutes = require('./routes/urlRoutes.js');
const ErrorHandeler = require('./middlewares/errorMiddleware.js');

const app = express();

app.use(express.json());
app.use(ErrorHandeler);

app.use('/', testRoute);
app.use('/', urlRoutes);

async function StartServer(){
    try{
        await StartDB();
        app.listen(3000, ()=>{
            console.log("Server running on port 3000!");
        })
    }catch(err){
        console.log("Failed to start the Server!");
        console.log(err.message);
    }
}

StartServer();

