const path = require('path');
const Store = require('../lib/store');
const promisify = require('util').promisify;
const mkdirp = promisify(require('mkdirp'));;
// const dirName = require('app-root-dir').set(__dirname);


//make the actual table that I will be refrencing

// function createDB (rootDir) {
//     return new Database (rootDir);
// }

class Database {
    constructor (rootDir) {
        this.rootDir = rootDir;
    }

    getStore (name) {
        const storeDir = path.join(this.rootDir, name );
        return mkdirp(storeDir)
            .then(() => {
                return new Store(storeDir);
            });
    }
}

module.exports = Database;