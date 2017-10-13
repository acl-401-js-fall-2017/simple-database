
const Store = require('./Store');
const path = require('path');
const {promisify} = require('util');
const mkdirAsync = promisify(require('fs').mkdir);


module.exports = class Db {
    constructor(path) {
        this.path = path;
    }

    getStore(storeName) {

        const storePath = path.join(this.path, storeName);

        return mkdirAsync(storePath)
            .then(() => {

                return new Promise((resolve) => {
                    resolve(new Store(storeName));
                });
            });
    }
};