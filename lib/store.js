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
    

    // save(obj, callback) {
    //     obj._id = shortid.generate();
    //     let file = path.join(this.directory, `${obj._id}.json`);
    //     let data = JSON.stringify(obj);
    //     fs.writeFile(file, data, err => {
    //         if (err) return callback(err);
    //         callback(null, obj);
    //     });
    // }

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

    // get(objid, callback){
    //     let sourceFile = path.join(this.directory, `${objid}.json`);
    //     fs.readFile(sourceFile, 'utf8', (err, data) =>{
    //         if ((err) && err.code === 'ENOENT') return callback(null, null);
    //         if (err) return callback(err);
    //         let gotObj = JSON.parse(data);
    //         callback(null, gotObj);
    //     });
    // }


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
    


    getAll(items){
        // let allData = [];
        return readdir(this.directory, 'utf8')
            .then ((data) => {
                let expectedDataCount = data.length;
                let receivedDataCount = 0;
                if(data.length === 0) return items;
                data.forEach((x) => {
                    let itemID = x.split('.')[0];
                    this.get(itemID);
                    allData.push(data);
                    receivedDataCount += 1;
                    if (receivedDataCount === expectedDataCount) {
                        return allData;
                    }
                });
            });
    }
}


    // getAll(callback){
    //     let allData = [];
    //     fs.readdir(this.directory, 'utf8', (err, data)=>{
    //         if (err) return callback(err);
    //         let expectedDataCount = data.length;
    //         let receivedDataCount = 0;
    //         if(data.length === 0) return callback(data);
    //         data.forEach((x) =>{
    //             let itemID = x.split('.')[0];
                
    //             this.get(itemID, (err, data)=>{
    //                 if (err) {
    //                     return callback(err);
    //                 }
    //                 allData.push(data);
    //                 receivedDataCount += 1;
    //                 if (receivedDataCount === expectedDataCount) {
    //                     return callback(allData, null);
    //                 }
    //             });
    //         });
    //     });
    // }



module.exports = Store; 
