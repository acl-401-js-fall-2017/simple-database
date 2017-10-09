const shortid = require('shortid');
const fs = require('fs');
const path = require('path');

class Store {
    constructor (root) {
        this.root = root;

    }

    save(object, callback) {
        object._id = shortid.generate();
        
        const filePath = path.join(this.root,  object._id + '.json'); // Caps??
        
        fs.writeFile(filePath, JSON.stringify(object), err => {
            if(err) return callback(err);
            callback(null, object);
        });
    }

    get(id, callback) {
        const filePath = path.join(this.root,  id + '.json');
        
        fs.readFile(filePath, (err, data) => {
            // if(err) return callback(err); ENOENT!!!!!
            if(err) return callback(null, null);
            const contents = JSON.parse(data);
            callback(null, contents);
        });  
    }

    remove(id, callback) {
        //fs.unlink(path, callback)
        const filePath = path.join(this.root,  id + '.json');

        fs.unlink(filePath, err => {
            // if(err) return callback(err); err returns {removed: false}
            if(err) return callback(null, {removed: false});
            callback(null, {removed: true});
        });
    }

    getAll(callback) {
        fs.readdir(this.root,(err, files) =>{
            if(err) callback(err);
            const contentsArr = [];
            let count = 0;
            
            files.forEach(file => {
                const filePath = path.join(this.root, file);
                
                fs.readFile(filePath, (err, data) => {
                    if(err) return callback(err);
                    contentsArr.push(JSON.parse(data));
                    count++;
                    if(count === files.length) {
                        callback(null, contentsArr);
                    }
                
                }); 
            });
        });
    }
   
}

module.exports = Store;