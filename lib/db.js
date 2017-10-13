const path = require('path');
const promisify = require('util').promisify;
const mkdirp = promisify(require('mkdirp'));

const Store = require('../lib/store');

module.exports = {
    rootDir: __dirname,
    createTable(table) {
        const dir = path.join(this.rootDir, table);
        return mkdirp(dir)
            .then(() => new Store(dir));
    }
};




// class Database {
//     constructor (rootDir) {
//         this.rootDir = rootDir;
//     }

//     getStore (name, callback) {
//         const storeDir = path.join(this.rootDir, name );
//         mkdirp(storeDir, err => {
//             if(err) return callback(err);
//             const newStore = new Store(storeDir);
//             callback(null, newStore);
//         });
//     }
// }

// module.exports = Database;