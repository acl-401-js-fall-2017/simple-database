const shortid = require('shortid');
const fs = require('fs');
const path = require('path');
// const rootDir = path.join(__dirname, 'data') //replace data when needed
// const { writeFile } = require('../fsp');
const promisify = require('util').promisify;
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);
const readdir = promisify(fs.readdir);

class Store {

    constructor(root) {
        this.root = root;
    }

    save(object) {
        object._id = shortid.generate();
        const filePath = path.join(this.root, object._id + '.json');
        return writeFile(filePath, JSON.stringify(object))
            .then(() => object);
    }


    get(id) {
        const filePath = path.join(this.root, id + '.json');

        return readFile(filePath)
            .then((data) => {
                return JSON.parse(data);
            })
            .catch(err => {
                return null;
            }); 
    }

    remove(id) {
        const filePath = path.join(this.root, id + '.json');

        return unlink(filePath)
            .then(() => {
                return { removed: true };
            })
            .catch(err => {
                return { removed: false };
            });
    }

    getAll() {
        readdir(this.root)
            .then(files => files.map(file => path.join(this.root, file)))
            .then(filePaths => {
                return Promise.all(
                    filePaths.map( file => readFile(file, 'utf8'))
                );
            });     
    }
}

module.exports = Store;