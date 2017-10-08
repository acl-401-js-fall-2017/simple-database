
const shortid = require('shortid');
const fs = require('fs');
const path = require('path');

class Store {
    constructor(rootDir) {
        this.rootDir = rootDir;
    }
    
    save(object, callback ) {
        object._id = shortid.generate();
        const fileName = path.join(this.rootDir, object._id + '.json' );

        fs.writeFile(fileName, JSON.stringify(object), err => {
            if(err) return callback(err);
            callback(null, object);
        });
    
        
    }

    get(id, callback) {
        const fileName = path.join(this.rootDir, id + '.json' );

        fs.readFile(fileName, (err, object) => {
            if(err) return callback(err);
            const fileContents = JSON.parse(object);
            callback(null, fileContents);
        });

    }

    remove(id, callback) {
        const fileName = path.join(this.rootDir, id + '.json' );

        fs.unlink(fileName, err => {
            if(err) return callback(err, { removed: false });
            return callback(null, {removed: true });
            
        });
    }

    getAll(callback) {

        fs.readdir(this.rootDir, (err, files) => {
            if(err) return callback(null, files);

            let fileList = [];
            let count = files.length;

            files.forEach(file => {
                const filePath = path.join(this.rootDir, file );

                fs.readFile(filePath, 'utf8', (err, contents) => {
                    if(err) return callback(null, null);
                    fileList.push(JSON.parse(contents) );
                    count --;
                    if(count === 0 ) callback(null, fileList);
                });

            });

        });


    }

}
module.exports = Store;