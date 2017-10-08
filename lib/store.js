
const shortid = require('shortid');
const fs = require('fs');
const path = require('path');

class Store {
    constructor(rootDir) {
        this.rootDir = rootDir;
    }
    
    save(object, callback ) {
        object._id = shortid.generate();
        const fileName = path.join(this.rootDir, object._id + '.json' );

        fs.writeFile(fileName, JSON.stringify(object), err => {
            if(err) return callback(err);
            callback(null, object);
        });
    
        
    }

    get(id, callback) {
        const fileName = path.join(this.rootDir, id + '.json' );

        fs.readFile(fileName, (err, object) => {
            if(err) return callback(err);
            const fileContents = JSON.parse(object);
            callback(null, fileContents);
        });

    }

}
module.exports = Store;