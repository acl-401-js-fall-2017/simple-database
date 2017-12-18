const path = require('path');
const { mkdirp } = require('./fsp');
const Store = require('./store');

class Db {
    constructor(rootDir){
        this.rootDir = rootDir;
    }

    getStore() {
        const testRootDir = path.join(__dirname, 'test-file');

        return mkdirp(testRootDir) 
            .then(() => {
                return new Store(testRootDir);
            });
    }
}

module.exports = Db;
