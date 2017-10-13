
const {readFile, writeFile, readdir, unlink} = require('./promisified');
const shortid = require('shortid');
const path = require('path');

class Store {
    constructor(rootDir) {
        this.rootDir = rootDir;
    }
    
    save(object) {
        object._id = shortid.generate();
        const fileName = path.join(this.rootDir, object._id + '.json' );

        return writeFile(fileName, JSON.stringify(object))
            .then(() => object);
    
        
    }

    get(id) {
        const fileName = path.join(this.rootDir, id + '.json' );

        return readFile(fileName, 'utf8') 
            .then(object => JSON.parse(object))
            .catch(err => {
                if(err.code === 'ENOENT') return null;
                throw err;
            });

    }

    remove(id) {
        const fileName = path.join(this.rootDir, id + '.json' );

        return unlink(fileName)
            .then( () => {
                return {removed: true };
            })
            .catch(err => {
                if(err.code === 'ENOENT') return { removed: false };
                throw err;
            });
    }

    getAll() {

        return readdir(this.rootDir)
            .then(files => {
                return files.map(file => path.basename(file, '.json'));
            })
            .then(ids => {
                return Promise.all(ids.map(id => this.get(id)));
            });

    }

}
module.exports = Store;