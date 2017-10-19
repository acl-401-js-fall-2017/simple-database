const path = require('path');
const { mkdirp } = require('./fsp');
const Store = require('./store');

module.exports = class Db {
    constructor(rootDir){
        this.rootDir = rootDir;
    }

    getStore(name) {
        const testRootDir = path.join(this.rootDir, 'test-file');

        return mkdirp(testRootDir) 
            .then(() => {
                return new Store(testRootDir);
            });
    }
};
