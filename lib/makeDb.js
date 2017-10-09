const path = require('path');
const Store = require('store.js');
const mkdirp = require('mkdirp');
// const dirName = require('app-root-dir').set(__dirname);


//make the actual table that I will be refrencing

module.exports = {
    rootDir : _dirname, 
    createTable(table, callback) {
        const dir = path.join(_dirname, )
    }

   
    getStore (name, callback) {
        const storeDir = path.join(this.rootDir, name );
        mkdirp(storeDir, err => {
            if(err) return callback(err);
            const newStore = new Store(storeDir);
            callback(null, newStore);
        });
    }
}
};
