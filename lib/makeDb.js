const path = require('path');
const Store = require('store.js');
const mkdirp = require('mkdirp');
// const dirName = require('app-root-dir').set(__dirname);


//define root file-- folder we make call data



module.exports = function createDB (rootDir) {
    return new Database (rootDir);
};

class Database {
    constructor (rootDir) {
        this.rootDir = rootDir;
    }
   
    getStore (name, callback) {
        const storeDir = path.join(this.rootDir, name );
        mkdirp(storeDir, err => {
            if(err) return callback(err);
            const newStore = new Store(storeDir);
            callback(null, newStore);
        });
    }
}

