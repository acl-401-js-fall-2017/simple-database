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
        let file = path.join(this.directory, obj._id + '.json');
        let data = JSON.stringify(obj);
        fs.writeFile(file, data, err => {
            if (err) return callback(err);
            callback(null, obj);
        });
    }

    get(objid, callback){
        let sourceFile = path.join(this.directory, objid + '.json');
        fs.readFile(sourceFile, (err, data) =>{
            if (err) return callback(null);
            let gotObj = JSON.parse(data);
            return callback(gotObj);
        });
    }
    remove(objid, callback){
        let sourceFile = path.join(this.directory, objid + '.json');
        fs.unlink(sourceFile, (err)=>{
            if (err) return callback({removed: false});
            return callback({removed: true});
        });
    }
    getAll(callback){
        let allData = [];
        fs.readdir(this.directory, (err, data)=>{
            if (err) return callback(err);
            let expectedDataCount = data.length;
            let receivedDataCount = 0;
            console.log('iam the data from the readdir in the getall method', data);
            data.forEach((x) =>{
                let itemID = x.split('.')[0];
                console.log('I am itemID before the get method!', itemID);
                this.get(itemID, (data, err)=>{
                    if (err) {
                        return callback(err);
                    }
                    allData.push(data);
                    console.log('I am the data in the get function', data);
                    receivedDataCount += 1;
                    console.log('I am the allData in the get function', allData);
                    if (receivedDataCount === expectedDataCount) {
                        console.log('I am allData array being returned by getALL', allData);
                        return callback(allData);
                    }
                });
            });
        });
    }
}

module.exports = Store; 
