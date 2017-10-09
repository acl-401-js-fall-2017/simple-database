const fs = require('fs');
const shortid = require('shortid');

class Store{
    constructor(storeDir){
        this.dir=storeDir;
        fs.mkdir(this.dir, (err) => {
            if(err) throw err;
        });
    }
    save(item, callback){
        item._id =shortid.generate();
        fs.writeFile(
            this.dir + '/' + item._id +'.json',
            JSON.stringify(item),
            err => {
                if (err) callback(err);
                else  callback(null,item);   
            });

    }
}

module.exports = Store;