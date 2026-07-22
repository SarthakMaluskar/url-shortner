const {createClient} = require('redis');

const client = createClient();

client.on("error", (err)=>{
    console.log("Redis client error",err);
})

module.exports = client;