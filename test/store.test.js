const assert = require('assert');
const shortid = require('shortid');
const fs = require('fs');
const path = require('path');
//const rimraf = require('rimraf');




class Store {
    constructor() {
        this.directory = __dirname;
        this.list = [];
    }
    save(obj, callback) {
        obj._id = shortid.generate();
        let file = path.join(this.directory, obj._id + '.json');
        let data = JSON.stringify(obj);
        fs.writeFile(file, data, err => {
            if (err) return callback(err);
            callback(null, obj);
        });
    }
    get(objid, callback){
        let sourceFile =path.join(__dirname, objid + '.json');//TODO: change to proprer dir. 
        fs.readFile(sourceFile, (err, data) =>{
            if (err) return callback(err);
            let gotObj = JSON.parse(data);
            return callback(gotObj);
        });
    }
}


let store = null;
let obj1 = null;


describe('make store', () => {

    beforeEach(function() {
        store = new Store();
        obj1 = {
            name: 'dog'
        };
        //rimraf();
    });
    
   

    it('should get saved object', done => {
        store.save(obj1,(err, savedObj1) => {
            if (err) return done(err);
            assert.ok(savedObj1._id);
            assert.equal(savedObj1.name, obj1.name);

            store.get(savedObj1._id, (gotObj1, err) => {
                if (err) return done(err);
                assert.deepEqual(gotObj1, savedObj1);
                done();
            });
        }); 
    });
});