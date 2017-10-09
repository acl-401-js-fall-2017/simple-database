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
                if (err) callback(err, null);
                else callback(null, JSON.parse(data));
                console.log('this is the data       ' + data);
                console.log('this is the   path    ' + this.dir + '/' + id + '.json');

            }
        );
    }

    remove(id, callback){
        fs.unlink(
            this.dir + '/' + id + '.json',
            (err, data) => {
                if (err) callback(null, { removed: false });
                else callback(null, { removed: true });
            }
        );
    }

    getAll(callback){
        fs.red
    }

}

module.exports = Store;