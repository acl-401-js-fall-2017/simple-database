const Store = require('../lib/store');
const mkdirp = require('mkdirp');
const path = require('path');

class MakeDB {
    constructor(dir){
        this.rootDir = dir;
    }
    createStore(name, callback){
        const storeDir = path.join(this.rootDir, name);
        console.log('I AM INSIDE THE CREATE STORE HERE IS MY storeDIR:', storeDir);
        mkdirp(storeDir, (err) => {
            if(err) return callback(err);
            const store = new Store(storeDir);
            console.log('I AM INSIDE THE MkDIRP HERE IS MY store:', store);
            callback(null, store);
        });
    }
    
}

module.exports = MakeDB;