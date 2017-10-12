const assert = require('assert');
const promisify = require('util').promisify;
const MakeDB = require('../lib/make-db');
const path = require('path');
const rootDirectory = path.join(__dirname, 'data');
const DB = new MakeDB(rootDirectory);
const rimraf = promisify(require('rimraf'));
const fs = require('fs');

//Gives store and testObject global scope. 
let testObject = {
    name: 'dog'
};
let testObject2 = {
    name: 'cat'
};
let testObject3 = {
    name: 'horse'
};

describe('make dB and stores', () => {
    let store = null;
    
    
    
    // beforeEach( done => {
    //     rimraf(rootDirectory, err => {
    //         if (err) return done(err);
    //         DB.createStore('testerSHane', (err, theStore) => { 
    //             if (err) return done(err);
    //             store = theStore;
    //             done();
    //         });
    //     });
    // });
                
    beforeEach( () => {
        return rimraf(rootDirectory)
            .then (() => {
                return DB.createStore('testerSHane');
            })
            .then ((theStore) => {
                store = theStore;
            });
    });



    it('should get saved object', () => {
        return store.save(testObject) 
            .then ((testObject) => {
                assert.ok(savedtestObject._id);
                assert.equal(savedtestObject.name, testObject.name);
            })
            .then (() => {
                store.get(savedtestObject._id) 
            })
            .then (() => {
                assert.deepEqual(gottestObject, savedtestObject);
            }); 
    });


    // it('should get saved object', done => {
    //     store.save(testObject,(err, savedtestObject) => {
    //         if (err) return done(err);
    //         assert.ok(savedtestObject._id);
    //         assert.equal(savedtestObject.name, testObject.name);
    //         store.get(savedtestObject._id, (err, gottestObject) => {
    //             if (err) return done(err);
    //             assert.deepEqual(gottestObject, savedtestObject);
    //             done();
    //         });
    //     }); 
    // });


    it('should get "bad id" return null', done => {
        assert.deepEqual(store.get('bad id', done), null);
    });


    it('should remove object with id', done => {
        store.save(testObject, (err, savedtestObject) => {
            store.remove(savedtestObject._id, (err, bool) => {
                if (err) return done(err);
                assert.deepEqual(bool, { removed: true });
                store.get(savedtestObject._id, (err, data) => {
                    if (err) return done(err);
                    assert.deepEqual(data, null);
                    done();
                });               
            });
        });    
    });


    it('should return remove false when passed bad id', done =>{
        store.remove('bad id', (err, bool)=>{
            if (err) return done(err);
            assert.deepEqual(bool, {removed: false});
            done();
        });
    });


    it('getAll() should return an empty array for a newly created store', done => {
        store.getAll((data, err)=>{
            if (err) return done(err);
            assert.deepEqual(data, []);
            done();
        });
    });

    it('should return an array of all objects in the directoy.', done => {
        store.save(testObject, (err, data)=>{
            if (err) return done(err);
            let savedObj1 = data;
            store.save(testObject2, (err, data)=>{
                if (err) return done(err);
                let savedObj2 = data;
                store.save(testObject3, (err, data)=>{
                    if (err) return done(err);
                    let savedObj3 = data;
                    store.getAll((data, err) =>{
                        if (err) return done(err);
                        let sortedData = data.map((obj)=>{
                            return obj.name;
                        });
                        assert.deepEqual(sortedData.sort(), [savedObj1.name, savedObj2.name, savedObj3.name].sort());
                        done();
                    });
                });               
            });
        });
    });

 
    it('getStore should return an instance of the store', done => {
        DB.getStore('animals', (err, data) => {
            if (err) return done(err);
            let getStoreOutput = data;
            fs.readdir(getStoreOutput.directory, (err, data) => {
                if(err) return done(err);
                assert.deepEqual(data, []);
                assert.deepEqual(getStoreOutput.directory, path.join(rootDirectory, 'animals'));
                done();
            });
        });
    });


    it('should create two store instances on unique paths', (done) => {
        DB.getStore('michele', (err, data) => {  //eslint-disable-line
            if(err) return done(err);
            fs.readdir(DB.rootDir, (err, data) => {
                if(err) return done(err);
                let sortedPathNames = data.sort();
                assert.deepEqual(sortedPathNames, ['michele', 'testerSHane']);
                done();
            });
        });
    });
});