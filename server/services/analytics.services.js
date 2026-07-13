const Click = require('../models/Click');

const addClickEvent = async (urlID) => {


    try {
        const click = new Click({
            url: urlID
        })

        await click.save();
        
    }catch(error){
        console.log(error);
        const err = new Error("Database Error : failed while adding cilck doc");
        err.status = 400;
        throw err;
    }
   

}


module.exports = {
    addClickEvent
}