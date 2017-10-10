const fs = require('fs');
const shortid = require('shortid');

class Store{
    constructor(storeDir){
        if(!fs.existsSync(storeDir)){
            this.dir=storeDir;
            fs.mkdir(this.dir, (err) => {
                if(err) throw err;
            });
        }
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

        let allItems = [];

        fs.readdir(this.dir, (err, items) => {
            if(err){
                console.error(err);
            }
            items.forEach((item, i) => {
                fs.readFile(this.dir +'/' + item, (err, data) => {
                    if(err){
                        console.error(err);
                    }
                    allItems.push(JSON.parse(data));
                    if(i === items.length-1) callback(null, allItems);
                }); 
            });
        });
    }

}

module.exports = Store;