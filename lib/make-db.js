const path = require('path');
const { mkdirp } = require('./fsp');
const Store = require('../lib/store');

module.exports = class Db {
    constructor(rootDir){
        this.rootDir = rootDir;
    }

    getStore(name) {
        const testRootDir = path.join(this.rootDir, name);

        return mkdirp(testRootDir) 
            .then(() => {
                return new Store(testRootDir);
            });
    }
};
