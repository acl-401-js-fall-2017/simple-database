const shortid = require('shortid');
const fs = require('fs');
const path = require('path');
// const rootDir = path.join(__dirname, 'data') //replace data when needed


class Store {
    constructor (rootDir) {
        this.rootDir = rootDir;

    }

    save(object, callback) {
        object._id = shortid.generate();
        
        const filePath = path.join(this.rootDir,  object._id + '.json'); // Caps??
        const contents = JSON.stringify(object);

        fs.writeFile(filePath, contents, err => {
            if(err) return callback(err);
            callback(null, object);
        });
    }

    get(id, callback) {
        const filename = path.join(this.rootDir, id + '.json');
        fs.readFile(filename, (err, contents) => {
            if (err) return callback(err);
            callback(null, JSON.parse(contents));
        });
    }
   
}

module.exports = Store;