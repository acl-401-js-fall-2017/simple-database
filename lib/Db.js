
const Store = require('./Store');
const path = require('path');
const fs = require('fs');
const {promisify} = require('util');
const mkdirAsync = promisify(fs.mkdir);


module.exports = class Db {
    constructor(path) {
        this.path = path;
        if(!fs.existsSync(this.path)) {
            fs.mkdirSync(this.path);
        }
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