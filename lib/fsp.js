const promisify = require('util').promisify;
const fs = require('fs');

module.exports = {
    readFile: promisify(fs.readFile),
    writeFile: promisify(fs.writeFile),
    readdir: promisify(fs.readdir),
    mkdir: promisify(fs.mkdir),
    unlink: promisfy(fs.unlink)
};