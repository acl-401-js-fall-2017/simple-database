const shortid = require('shortid');
const fs = require('fs');
const path = require('path');


class Store {
    constructor(root) {
        this.directory = root;
        this.list = [];
    }
    

    save(obj, callback) {
        obj._id = shortid.generate();
        let file = path.join(this.directory, `${obj._id}.json`);
        let data = JSON.stringify(obj);
        fs.writeFile(file, data, err => {
            if (err) return callback(err);
            callback(null, obj);
        });
    }


    get(objid, callback){
        let sourceFile = path.join(this.directory, `${objid}.json`);
        fs.readFile(sourceFile, 'utf8', (err, data) =>{
            if ((err) && err.code === 'ENOENT') return callback(null, null);
            if (err) return callback(err);
            let gotObj = JSON.parse(data);
            callback(null, gotObj);
        });
    }


    remove(objid, callback){
        let sourceFile = path.join(this.directory, `${objid}.json`);
        fs.unlink(sourceFile, (err) => {
            if ((err) && err.code === 'ENOENT') return callback(null, null);
            if (err) return callback(null, {removed: false});
            return callback(null, {removed: true});
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
