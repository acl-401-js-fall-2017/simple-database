const path = require('path');
const Store = require('../lib/store');
const promisify = require('util').promisify;
const mkdirp = promisify(require('mkdirp'));


class Database {
    constructor (rootDir) {
        this.rootDir = rootDir;
    }

    getStore (name) {
        const storeDir = path.join(this.rootDir, name );
        return mkdirp(storeDir)
            .then(() => new Store(storeDir));
    }
}

module.exports = Database;