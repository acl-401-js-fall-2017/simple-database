const fs = require('fs');
const shortid = require('shortid');
const path = require('path');

// The store offers save, get, getAll, and remove methods.
// Use json as a file format to store (serialized and deserialized) 
// javascript objects.

class Store {
    constructor(rootDir) {
        this.rootDir = rootDir;
    }
    save(object, callback) {
        object._id = shortid.generate();
        const fileName = path.join(this.rootDir, object._id + '.json');

        fs.writeFile(fileName, JSON.stringify(object), err => {
            if(err) return callback(err);
            callback(null, object);
        });

    }
    get(id, callback) {
        const fileName = path.join(this.rootDir, id + '.json');

        fs.readFile(fileName, (err, object) => {
            if(err) return callback(err);
            const fileContents = JSON.parse(object);
            callback(null, fileContents);
        });
    }

}

module.exports = Store;