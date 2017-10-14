const Store = require('../lib/store');
const promisify = require('util').promisify;  //eslint-disable-line
const {mkdirp} = require('./fsp');
const path = require('path');


class MakeDB {
    constructor(dir){
        this.rootDir = dir;
    }


    getStore(name){
        let storeDir = path.join(this.rootDir, name);
        return mkdirp(storeDir)
            .then (() => {
                return new Store(storeDir);
            });
    }

    
}


module.exports = MakeDB;