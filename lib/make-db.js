const Store = require('../lib/store');
const mkdirp = require('mkdirp');
const path = require('path');

class MakeDB {
    constructor(dir){
        this.rootDir = dir;
    }
    createStore(name, callback){
        const storeDir = path.join(this.rootDir, name);
        mkdirp(storeDir, (err) => {
            if(err) return callback(err);
            const store = new Store(storeDir);
            callback(null, store);
        });
    }
    
}

module.exports = MakeDB;