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
    // save file name with an id
    save(object, callback) {
        object._id = shortid.generate();
        const fileName = path.join(this.rootDir, object._id + '.json');
        // write stringified data into file 
        fs.writeFile(fileName, JSON.stringify(object), err => {
            if(err) return callback(err);
            callback(null, object);
        });
    }
    // get file contents with id
    get(id, callback) {
        const fileName = path.join(this.rootDir, id + '.json');
        // read the parsed file contents with id
        fs.readFile(fileName, (err, object) => {
            if(err) return callback(err);
            const fileContents = JSON.parse(object);
            callback(null, fileContents);
        });
    }

    remove(id, callback) {
        const fileName = path.join(this.rootDir, id + '.json');
        // remove file by id
        fs.unlink(fileName, err => {
            if(err) return callback(err, {removed: false});
            return callback(null, {removed: true});
        });
    }

    
}

module.exports = Store;