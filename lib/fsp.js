const promisify = require('util').promisify;
const fs = require('fs');

module.exports = {
    readFile: promisify(fs.readFile),
    writeFile: promisify(fs.writeFile),
    readdir: promisify(fs.readdir),
    mkdirp: promisify(require('mkdirp')),
    unlink: promisify(fs.unlink),
    rimraf: promisify(require('rimraf'))
};