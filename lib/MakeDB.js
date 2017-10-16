const path = require('path');
const promisify = require('util').promisify;
const mkdirp = promisify(require('mkdirp'));

const Store = require('../lib/store');

// module.exports = {

class MakeDB {
    constructor(dir) {
        this.rootDir = dir;
    }
 
    // rootDir: __dirname,

    createTable(name) {
        const tableDir = path.join(this.rootDir, name);
        return mkdirp(tableDir)
            .then(() => new Store(tableDir));
    }

    getStore(name){
        return this.createTable(name);
    }
}

module.exports = MakeDB;
// };

