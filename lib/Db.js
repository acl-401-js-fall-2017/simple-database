
const Store = require('./Store');
const path = require('path');
const fs = require('fs');
const {promisify} = require('util');
const mkdirAsync = promisify(fs.mkdir);


module.exports = class Db {
    constructor(_path) {
        this.path = _path;
        if(!fs.existsSync(this.path)) {
            fs.mkdirSync(this.path);
        }
        console.log(fs.readdirSync(path.join(__dirname, '..', 'test')));
    }

    getStore(storeName) {

        const storePath = path.join(this.path, storeName);

        if(fs.existsSync(storePath)) {
            
            return new Promise((resolve) => {
                resolve(new Store(storePath));
            });
        }
        else {
            return mkdirAsync(storePath)
                .then(() => {
    
                    return new Promise((resolve) => {
                        resolve(new Store(storePath));
                    });
                });
        }
    }
};