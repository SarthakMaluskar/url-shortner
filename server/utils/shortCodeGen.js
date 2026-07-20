//task is to generate a 6 char random string.
//my idea is to create an array with all chars like A-Z and a-z and 0-9 then use inbuilt math.random func to pick a num from 0 - 61 so it chooses a random char and then i ll append to a string this process 6 times
//but this seems slow for production grade project, thinking of other way

const { nanoid, customAlphabet } = require('nanoid');

const generateMyID = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", 6);

function ShortCodeGen(){

    const shortCode = generateMyID();
    
    return shortCode;

}



module.exports = ShortCodeGen;