const assert = require('assert');
const MakeDB = require('../lib/make-db');
const path = require('path');
const rootDirectory = path.join(__dirname, 'data');
const DB = new MakeDB(rootDirectory);
const rimraf = require('rimraf');
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
            store.get(savedtestObject._id, (err, gottestObject) => {
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
                store.get(savedtestObject._id, (err, data)=>{
                    if (err) return done(err);
                    assert.deepEqual(data, null);
                    done();
                });
                
            });
        });
        
    });

    it('should return remove false when passed bad id', done =>{
        store.save(testObject, ()=>{
            store.remove('bad id', (bool, err)=>{
                if (err) return done(err);
                assert.deepEqual(bool, {removed: false});
                done();
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

 
    it.only('getStore should return an instance of the store', done => {
        DB.getStore('animals', (err, data) => {
            if (err) return done(err);
            let getStoreOutput = data;
            console.log('store instance inside of get store', data);
            // DB.createStore('animals', (err, theStore) => { 
            //     if (err) return done(err);
            //     let createStoreOutput = theStore;
            //     assert.deepEqual(createStoreOutput, getStoreOutput);
            //     done();
            // });
            fs.readdir(getStoreOutput.directory, (err, data) => {
                if(err) return done(err);
                assert.deepEqual(data, []);
                done();
            });

        });
    });
});