const path = require('path');
const Store = require('../lib/store');
const mkdirp = require('mkdirp');
// const dirName = require('app-root-dir').set(__dirname);


//make the actual table that I will be refrencing

// function createDB (rootDir) {
//     return new Database (rootDir);
// }

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

module.exports = Database;