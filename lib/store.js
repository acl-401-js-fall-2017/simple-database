const shortid = require('shortid');
const promisify = require('util').promisify;
// const fs = promisify(require('fs'));
const path = require('path');
const {writeFile, readFile, unlink, readdir} = require('./fsp');


class Store {
    constructor(root) {
        this.directory = root;
        this.list = [];
    }
    
    
    save(obj) {
        obj._id = shortid.generate();
        let file = path.join(this.directory, `${obj._id}.json`);
        let data = JSON.stringify(obj);
        return writeFile(file, data)
            .then(() => {
                return JSON.parse(data);
            });
    }
    

    get(objid) {
        let sourceFile = path.join(this.directory, `${objid}.json`);
        return readFile(sourceFile, 'utf8') 
            .then ((data) => {
                return JSON.parse(data);
            })
            .catch((err) => {
                if (err.code === 'ENOENT') return null;
                throw err;
            });
    }



    remove(objid){
        let sourceFile = path.join(this.directory, `${objid}.json`);
        return unlink(sourceFile)
            .then (() => {
                return {removed: true};
            })
            .catch (() => {
                return {removed: false};
            });
    }
    

    getAll(){
        return readdir(this.directory, 'utf8')
            .then ((files) => {
                return files.map(file => path.basename(file, '.json'));
            })
            .then ((ids) => {
                return Promise.all(ids.map(id => this.get(id)));
            });
    }           
}


module.exports = Store; 
