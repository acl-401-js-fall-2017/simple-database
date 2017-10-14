const chai = require('chai');
const assert = chai.assert;
const MakeDB = require('../lib/make-db');
const promisify = require('util').promisify;
const path = require('path');
const rootDirectory = path.join(__dirname, 'data');
const DB = new MakeDB(rootDirectory);
const rimraf = promisify(require('rimraf'));
const fs = require('fs');
const readdir = promisify(fs.readdir);

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


    it('getAll() should return an empty array for a newly created store', () => {
        store.getAll()
            .then((data) => {
                assert.deepEqual(data, []);
            });
    });


    it('returns an array of all objects in the file system', () => {
        let saveArr = [testObject, testObject2, testObject3];

        return Promise.all(
            saveArr.map((obj)=> store.save(obj))
        )
            .then((saves) => {
                return store.getAll()
                    .then(output => {
                        console.log('I AM OUTPUT!!',output);
                        console.log('I AM saves!!',saves);
                        assert.equal(output.length, 3);
                        assert.deepInclude(output, saves[0]);
                        assert.deepInclude(output, saves[1]);
                        assert.deepInclude(output, saves[2]);
                    });
            });
    });

 
    it('getStore should return an instance of the store', () => {
        return DB.getStore('animals')
            .then((data) => {
                readdir(data.directory, 'utf8')
                    .then((dir) => {
                        assert.deepEqual(dir, []);
                        assert.deepEqual(data.directory, path.join(rootDirectory, 'animals'));
                    });
            });
    });



    it('should create two store instances on unique paths', () => {
        DB.getStore('michele')
            .then(() => {
                return readdir(DB.rootDir)
                    .then((data) => {
                        assert.deepEqual(data.sort(), ['michele', 'testerSHane']);
                    });
            });
    });
});