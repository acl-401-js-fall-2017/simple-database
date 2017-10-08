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
        
        fs.writeFile(filePath, JSON.stringify(object), err => {
            if(err) return callback(err);
            callback(null, object);
        });
    }

    get(id, callback) {
        const filePath = path.join(this.dataDir,  id + '.json');
        
        fs.readFile(filePath, (err, data) => {
            // if(err) return callback(err); ENOENT!!!!!
            if(err) return callback(null, null);
            const contents = JSON.parse(data);
            callback(null, contents);
        });  
    }

    remove(id, callback) {
        //fs.unlink(path, callback)
        const filePath = path.join(this.dataDir,  id + '.json');

        fs.unlink(filePath, err => {
            // if(err) return callback(err); err returns {removed: false}
            if(err) return callback(null, {removed: false});
            callback(null, {removed: true});
        });

    }
   
}

module.exports = Store;