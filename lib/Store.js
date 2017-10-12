
const shortid = require('shortid');
const path = require('path');
const fs = require('fs');

const {promisify} = require('util');
const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);

module.exports = class Store {
    constructor(path) {
        this.path = path;
    }

    save(obj) {
        const objCopy = Object.assign({}, obj);
        objCopy._id = shortid.generate();

        return writeFileAsync(path.join(this.path, objCopy._id) + '.json', JSON.stringify(objCopy))
            .then((err) => {
                if(err) throw err;
                return new Promise((resolve, reject) => {
                    resolve(objCopy);
                    reject(null);
                });
            });
    }

    get(id) {
        return readFileAsync(path.join(this.path, id) + '.json')
            .then(data => {
                return JSON.parse(data);
            })
            .catch(() => null);
    }
};