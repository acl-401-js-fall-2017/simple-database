const shortid = require('shortid');

class Store {
    constructor (data) {
        this.data = data;
    }

    save(object) {
        object._id = shortid.generate();
        return object;
    }
    //save object
    //get object
    //get all
    //remove
}

module.exports = Store;