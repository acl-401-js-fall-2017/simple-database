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
        let sourceFile =path.join(this.directory, objid + '.json');
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
}

module.exports = Store; 
