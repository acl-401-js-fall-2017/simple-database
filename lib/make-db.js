const Store = require('../lib/store');
const promisify = require('util').promisify;
const mkdirp = promisify(require('mkdirp'));
const path = require('path');


class MakeDB {
    constructor(dir){
        this.rootDir = dir;
    }


    createStore(name){
        const storeDir = path.join(this.rootDir, name);
        return mkdirp(storeDir)
            .then((storeDir) => {
                return new Store(storeDir);
            });
            
    }


    getStore(name, callback) {
        this.createStore(name, (err, storeInstance) => {
            if(err) return callback(err);
            callback(null, storeInstance);
        });
    }
    
}


module.exports = MakeDB;