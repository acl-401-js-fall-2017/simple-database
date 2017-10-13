
const promisify = require('util').promisify;
const fs = require('fs');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const shortid = require('shortid');
const path = require('path');
const unlink = promisify(fs.unlink);


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


    getAll(callback){
        let allData = [];
        fs.readdir(this.directory, 'utf8', (err, data)=>{
            if (err) return callback(err);
            let expectedDataCount = data.length;
            let receivedDataCount = 0;
            if(data.length === 0) return callback(data);
            data.forEach((x) =>{
                let itemID = x.split('.')[0];
                
                this.get(itemID, (err, data)=>{
                    if (err) {
                        return callback(err);
                    }
                    allData.push(data);
                    receivedDataCount += 1;
                    if (receivedDataCount === expectedDataCount) {
                        return callback(allData, null);
                    }
                });
            });
        });
    }
}


module.exports = Store; 
