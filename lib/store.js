
const promisify = require('util').promisify;
const fs = require('fs');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const shortid = require('shortid');
const path = require('path');
const unlink = promisify(fs.unlink);
const readdir = promisify(fs.readdir);


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
                return obj;
            });
    }



    get(objid) {
        let sourceFile = path.join(this.directory, `${objid}.json`);
        return readFile(sourceFile, 'utf8')
            .then((data) => {
                return JSON.parse(data);
            })
            .catch(() => {
                return null;
            });
    }


    remove(objid){
        let sourceFile = path.join(this.directory, `${objid}.json`);
        return unlink(sourceFile)
            .then(()=>{
                return {removed: true};
            })
            .catch(() => {
                return {removed: false};
            });
    }


    getAll() {

        return readdir(this.directory, 'utf8')
            .then(files => files.map(file => path.join(this.directory, file)))
            .then(filePaths => {
                return Promise.all(
                    filePaths.map((file) => {
                        return readFile(file, 'utf8')
                            .then((data)=>{
                                return JSON.parse(data);
                            });
                    })
                );
            });
    }
}


module.exports = Store; 
