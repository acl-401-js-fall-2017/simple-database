// const fs = require('fs');
const shortid = require('shortid');
const path = require('path');
const { writeFile, readFile, unlink, readdir } = require('./fsp');

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
        const fileName = path.join(this.rootDir, id + '.json');
        // read the parsed file contents with id
        return readFile(fileName, 'utf8')
            .then(fileContent => JSON.parse(fileContent))
            .catch(err => {
                if (err.code === 'ENOENT') return null;
                throw err;
            });
    }

    remove(id) {
        const fileName = path.join(this.rootDir, id + '.json');
        // remove file by id
        return unlink(fileName)
            .then(() => {
                return { removed: true };
            })
            .catch(err => {
                if (err.code === 'ENOENT') return { removed: false };
                throw err;
            });
    }

    getAll() {
        // read the directory and capture the files in an array
        return readdir(this.rootDir)
            .then(allFiles => {
                let fileList = [];
                allFiles.forEach(file => {
                    const filePath = path.join(this.rootDir, file);

                    fileList.push(readFile(filePath, 'utf8'));
                });
                return Promise.all(fileList);
            })
            .then(fileContentArr => {
                return fileContentArr.map(fileContent => JSON.parse(fileContent));
            });
    }
}


module.exports = Store;