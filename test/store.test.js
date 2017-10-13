const assert = require('assert');
const MakeDB = require('../lib/make-db');
const promisify = require('util').promisify;
const path = require('path');
const rootDirectory = path.join(__dirname, 'data');
const DB = new MakeDB(rootDirectory);
const rimraf = promisify(require('rimraf'));
const fs = require('fs');

//Gives store and testObject global scope. 
let store = null;
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

    beforeEach(() => {
        return rimraf(rootDirectory)
            .then(() => {
                return DB.createStore('testerSHane');
            })
            .then((newStore)=>{
                store = newStore; 
            });
    });
    

    

    it('should get saved object', () => {
        store.save(testObject)
            .then((savedtestObject) => {
                return savedtestObject;
            })
            .then((savedtestObject) => {
                assert.ok(savedtestObject._id);
                assert.equal(savedtestObject.name, testObject.name);
                store.get(savedtestObject._id, (err, gottestObject) => {
                    assert.deepEqual(gottestObject, savedtestObject);
                });

            });
    });



    it('should get "bad id" return null', () => {
        store.get('bad id')
            .then((data) => {
                assert.deepEqual(data, null);
            });
    });


    describe('remove method', () => {
        it('returns {removed: true} for remove id', () => {
            return store.save(testObject)
                .then((data)=>{
                    return store.remove(data._id);
                })
                .then(obj => {
                    assert.deepEqual(obj, {removed: true});
                });
        });

        it('returns {removed: false} for get with bad id', () => {
            return store.save(testObject)
                .then(() => {
                    return store.remove('bad id');
                })
                .then(obj => {
                    assert.deepEqual(obj, { removed: false });
                });
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