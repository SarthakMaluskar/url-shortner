const {Queue} = require('bullmq');

const connection = require('../configs/bullmq');

const analyticsQueue = new Queue("analytics",{
    connection
})

module.exports = analyticsQueue;