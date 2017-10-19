const shortid = require('shortid');
const path = require('path');
const { writeFile, readFile, unlink, readdir } = require('./fsp');

class Store {
    constructor(rootDir) {
        this.rootDir = rootDir;
    }

    save(object) {
        object._id = shortid.generate();
        const fileName = path.join(this.rootDir, object._id + '.json');

        return writeFile(fileName, JSON.stringify(object))
            .then(() => {
                return object;
            });
    }

    get(id) {
        const fileName = path.join(this.rootDir, id + '.json');

        return readFile(fileName, 'utf8')
            .then(fileContent => JSON.parse(fileContent))
            .catch(err => {
                if (err.code === 'ENOENT') return null;
                throw err;
            });
    }

    remove(id) {
        const fileName = path.join(this.rootDir, id + '.json');

        return unlink(fileName)
            .then(() => {
                return { removed: true };
            })
            .catch(err => {
                if(err.code === 'ENOENT') return { removed: false };
                throw err;
            });
    }

    getAll() {

        return readdir(this.rootDir)
            .then(allFiles => {
                let fileList = [];
                allFiles.forEach(file => {
                    const filePath = path.join(this.rootDir, file);

                    fileList.push(readFile(filePath, 'utf8'));
                });
                return Promise.all(fileList);
            })
            .then(fileContentArr => {
                return fileContentArr.map(fileContent => JSON.parse(fileContent));
            });
    }
}


module.exports = Store;