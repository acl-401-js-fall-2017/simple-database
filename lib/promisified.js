const fs = require('fs');
const promisify = require('util').promisify;



module.exports = {
    mkdirp: promisify(require('mkdirp')),
    rimraf: promisify(require('rimraf')),
    writeFile: promisify(fs.writeFile),
    readFile: promisify(fs.readFile),
    readdir:  promisify(fs.readdir),
    unlink: promisify(fs.unlink)

};
