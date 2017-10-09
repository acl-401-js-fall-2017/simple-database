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
            }
        );
    }

    get(id, callback){
        fs.readFile(
            this.dir + '/' + id + '.json',
            (err, data) => {
                if (err) callback(err);
                else callback(null, JSON.parse(data));
            }
        );
    }
}

module.exports = Store;