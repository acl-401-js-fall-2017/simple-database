const path = require('path');
const mkdirp = require('mkdirp');
const Store = require('../lib/store');

class Db {
    constructor(rootDir){
        this.rootDir = rootDir;
    }

    getStore(name, callback) {
        const testRootDir = path.join(__dirname, 'data');

        mkdirp(testRootDir, err => {
            if(err) return callback(err);
            const store = new Store(testRootDir);
            callback(null, store);
        });
    }
}
module.exports = Db;