const shortid = require('shortid');
const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;
// const mkdir = promisify(fs.mkdir);
const readdir = promisify(fs.readdir);
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);



class Store {

    constructor (root) {
        this.root = root;
    }

    save(object) {
        object._id = shortid.generate();
        const filename = path.join(this.root, object._id + '.json');
        const contents = JSON.stringify(object);

        return writeFile(filename, contents)
            .then(() => object);
    }

    get(id) {

        const filePath = path.join(this.root,  id + '.json');

        return readFile(filePath, 'utf8')
            .then(contents => JSON.parse(contents))
            .catch(() => (null)); 
    }

    remove(id) {
        
        const filePath = path.join(this.root,  id + '.json');

        return unlink(filePath)
            .then( () => ({ removed: true }))
            .catch(() => ({ removed: false }));
            

        
    }

    getAll() {

        return readdir(this.root)
            .then(files => files.map(file => path.join(this.root, file)))
            .then(filePaths => {
                return Promise.all(
                    filePaths.map( file => readFile(file, 'utf8'))
                );
            });

            
        //     files.forEach(file => {
        //         const filePath = path.join(this.root, file);
                
        //         fs.readFile(filePath, (err, data) => {
        //             if(err) return callback(err);
        //             contentsArr.push(JSON.parse(data));
        //             count++;
        //             if(count === files.length) {
        //                 callback(null, contentsArr);
        //             }
                
        //         }); 
        //     });

        // });
    }
   
}

module.exports = Store;