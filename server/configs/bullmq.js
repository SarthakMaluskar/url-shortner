
const IORedis = require('ioredis');

const connection = new IORedis({
    maxRetriesPerRequest: null,
});

//lets export connection from here so we can use it.
module.exports = connection;



// const myQueue = new Queue('myqueue', {
//     connection
// })

// const myWorker = new Worker('myqueue',
//     async job =>{
//         console.log(job.data);
//     },
//     {
//     connection
// })


// const test = async()=>{
//     await myQueue.add('paint', {colour : 'red'});
//     await myQueue.add('paint', {colour : 'blue'});
//     await myQueue.add('paint', {colour : 'orange'});
//     await myQueue.add('paint', {colour : 'green'});

// }

// test();