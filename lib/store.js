const shortid = require('shortid');
const fs = require('fs');
const path = require('path');

class Store {
    constructor (dataDir) {
        this.dataDir = dataDir;

    }

    save(object, callback) {
        object._id = shortid.generate();
        
        const filePath = path.join(this.dataDir,  object._id + '.json'); // Caps??
        const contents = JSON.stringify(object);

        fs.writeFile(filePath, contents, err => {
            if(err) return callback(err);
            callback(null, object);
        });
    }
   
}

module.exports = Store;