const promisify = require('util').promisify;
const fs = require('fs');
const mkdirp= require('mkdirp');

module.exports = {
    readdir: promisify(fs.readdir),
    readFile: promisify(fs.readFile),
    writeFile: promisify(fs.writeFile),
    mkdirp: promisify(mkdirp),
    unlink: promisify(fs.unlink)
};