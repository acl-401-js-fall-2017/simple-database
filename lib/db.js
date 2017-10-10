const fs = require('fs');
const Store = require('./store.js');

class Db {
    constructor(rootDir, done){
        this.dbDirectory = rootDir + '/db';
        fs.mkdir(this.dbDirectory, err => {
            if(err) console.error(err);
            done();   
        });
    }
    getStore(storeName, callback){
        const newStore = new Store(this.dbDirectory + '/' + storeName);
        callback(null, newStore);
    }
}

module.exports = Db;