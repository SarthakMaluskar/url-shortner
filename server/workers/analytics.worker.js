const {Worker} = require('bullmq');


//mongoDB connection cause this is a whole new compleetely different process, and for addClickEvent we need the db.
const StartDB = require('../configs/db');
StartDB();

const connection = require('../configs/bullmq');

const {addClickEvent} = require('../services/analytics.services');



const myWorker = new Worker('analytics',
    async job =>{
        console.log("worker started addClickEvent");
        //here call the function addClickEvent
        // console.log(job.data.urlId);
        await addClickEvent(job.data.urlId);
        console.log("Added Click");
    },
    {
    connection
})

myWorker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});

myWorker.on("failed", (job, err) => {
    console.error(`Job ${job?.id} failed`, err);
});