const assert = require('assert');
const MakeDB = require('../lib/make-db');
const path = require('path');
const rootDirectory = path.join(__dirname, 'data');
const DB = new MakeDB(rootDirectory);
const rimraf = require('rimraf');


//Gives store and testObject global scope. 
let store = null;
let testObject = {
    name: 'dog'
};

describe('make store', () => {

    beforeEach( done => {//Removes "data" directory if one exists. Creates new "data" directory and a new Store instance. 
        rimraf(rootDirectory, err => {//Removes "data" directory. Invokes create store method on DB class.
            if (err) return done(err);
            DB.createStore('testerSHane', (err, theStore) => {//Creates an assigins new Store to "store variable" invokes done() 
                if (err) return done(err);
                store = theStore;
                done();
            });
        });
    });
    
   

    it('should get saved object', done => {
        store.save(testObject,(err, savedtestObject) => {
            if (err) return done(err);
            assert.ok(savedtestObject._id);
            assert.equal(savedtestObject.name, testObject.name);
            store.get(savedtestObject._id, (gottestObject, err) => {
                if (err) return done(err);
                assert.deepEqual(gottestObject, savedtestObject);
                done();
            });
        }); 
    });
    it('should get "bad id" return null', done => {
        assert.deepEqual(store.get('bad id', done), null);
    });
    it('should remove object with id', done => {
        store.save(testObject, (err, savedtestObject) =>{
            store.remove(savedtestObject._id, (bool, err)=>{
                if (err) return done(err);
                assert.deepEqual(bool, { removed: true });
                store.get(savedtestObject._id, (data, err)=>{
                    if (err) return done(err);
                    assert.deepEqual(data, null);
                    done();
                });
                
            });
        });
        
    });
    it('should return remove false when passed bad id', done =>{
        store.save(testObject, (err, savedtestObject)=>{
            store.remove('bad id', (bool, err)=>{
                assert.deepEqual(bool, {removed: false});
                done();
            });
        });
    });
});