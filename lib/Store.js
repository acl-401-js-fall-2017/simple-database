
const shortid = require('shortid');
const {promisify} = require('util');
const path = require('path');
const writeFileAsync = promisify(require('fs').writeFile);

module.exports = class Store {
    constructor(path) {
        this.path = path;
    }

    save(obj) {

        const objCopy = Object.assign({}, obj);
        objCopy._id = shortid.generate();
        
        return writeFileAsync(path.join(this.path, objCopy._id), JSON.stringify(objCopy))
            .then((err) => {
                if(err) throw err;
                return new Promise((resolve, reject) => {
                    resolve(objCopy);
                    reject(null);
                });
            });
    }
};