
const shortid = require('shortid');

module.exports = class Store {
    constructor(path) {
        console.log(path);
    }

    save(obj) {
        return new Promise((resolve, reject) => {
            const objCopy = Object.assign({}, obj);
            objCopy._id = shortid.generate();
            resolve(objCopy);
            console.log(objCopy);
        });
    }
};