// const rootDir = path.join(__dirname, 'data');
// const Store = require('../lib/store');

// Store is like a Table
// class MakeDb {
//     constructor(rootDir) {
//         this.rootDir;
//     }
//     createStore(name, callback) {
//         const storeDir = path.join(this.rootDir, name);
//         mkdirp(storeDir, err => {
//             if (err) return callback(err);
//             const store = new Store(storeDir);
//             callback(null, store);
//         });
//     }
// }

// module.exports = MakeDb;