const { mkdirp, } = require('../lib/promisified');
const path = require('path');
const Store = require('../lib/store');

class MakeDb {
    constructor(rootDir) {
        this.rootDir = rootDir;
    }

    getStore(name) {
        const testDir = path.join(__dirname, 'test-file');

        return mkdirp( testDir )
            .then( () => {
                return new Store(testDir);
            });
    }

}
module.exports = MakeDb;