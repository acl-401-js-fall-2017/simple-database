const fs = require('fs');
const shortid = require('shortid');
const path = require('path');
const { writeFile, readFile } = require('./fsp');

// The store offers save, get, getAll, and remove methods.
// Use json as a file format to store (serialized and deserialized) 
// javascript objects.

class Store {
    constructor(rootDir) {
        this.rootDir = rootDir;
    }
    // save file name with an id
    save(object) {
        object._id = shortid.generate();
        const fileName = path.join(this.rootDir, object._id + '.json');

        return writeFile(fileName, JSON.stringify(object))
            .then(() => {
                return object;
            });
    }
    // get file contents with id
    get(id) {
        console.log('I am an id', id);
        const fileName = path.join(this.rootDir, id + '.json');
        console.log('I am the filename', fileName);
        // read the parsed file contents with id
        return readFile(fileName, 'utf8')
            .then(fileContent => JSON.parse(fileContent)) 
            .catch(err => {
                if(err.code === 'ENOENT') return null;
                throw err;
            });
    }
        
    remove(id, callback) {
        const fileName = path.join(this.rootDir, id + '.json');
        // remove file by id
        fs.unlink(fileName, err => {
            if (err) return callback(err, { removed: false });
            return callback(null, { removed: true });
        });
    }

    getAll(callback) {
        // read the directory and capture the files in an array
        fs.readdir(this.rootDir, (err, allFiles) => {
            if (err) return callback(null, allFiles);

            let fileList = [];
            let count = allFiles.length;

            allFiles.forEach(file => {
                const filePath = path.join(this.rootDir, file);

                fs.readFile(filePath, 'utf8', (err, contents) => {
                    if (err) return callback(null, null);
                    fileList.push(JSON.parse(contents));
                    count--;
                    if (count === 0) callback(null, fileList);
                });
            });
        });
    }
}

module.exports = Store;