const fs = require('fs');


class Db {
    constructor(rootDir, done){
        const  dbDirectory = rootDir + '/db';
        fs.mkdir(dbDirectory, err => {
            if(err) console.error(err);
            done();   
        });
    }
}

module.exports = Db;