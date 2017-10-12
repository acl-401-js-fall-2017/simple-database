
const shortid = require('shortid');
const path = require('path');
const fs = require('fs');

const {promisify} = require('util');
const rimrafAsync = promisify(require('rimraf'));
const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);
const readDirAsync = promisify(fs.readdir);

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

    remove(id) {
        return readDirAsync(this.path)
            .then(data => {

                if(RegExp(id).test(data.join(''))) {
                    return rimrafAsync(path.join(this.path, id) + '.json')
                        .then(() => {
                            return { removed: true };
                        })
                        .catch(() => {
                            return { removed: false };
                        });
                }
                else return { removed: false };
            });
    }

    getAll() {
        return readDirAsync(this.path)
            .then(itemList => {
                const readFilePromiseArr = [];
                itemList.forEach(file => {
                    readFilePromiseArr.push(readFileAsync(file));
                });
                console.log(readFilePromiseArr);
                return Promise.all(readFilePromiseArr);
            })
            .then( fileDataArr => {
                console.log(fileDataArr);
                return fileDataArr.map( data => JSON.parse(data) );
            });
    }
};