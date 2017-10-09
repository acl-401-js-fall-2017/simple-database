const mkdirp = require('mkdirp');
const path = require('path');
const Store = require('../lib/store');

class MakeDb {
    constructor(rootDir) {
        this.rootDir = rootDir;
    }

    getStore(name, callback) {
        const testDir = path.join(__dirname, 'test-file');

        mkdirp( testDir, err => {
            if(err) return callback(err);
            const store = new Store(testDir);
            callback(null, store);
        });
    }

}
module.exports = MakeDb;