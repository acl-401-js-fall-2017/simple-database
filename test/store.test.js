const assert = require('assert');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const path = require('path');
const Store = require('../lib/store');

describe.only('creating store dir', () => {
    let store = null;
    const testDir = path.join(__dirname, 'test-file');
    
    let testFile;
    
    beforeEach( done => {
        rimraf( testDir, err => {
            if(err) return done(err);
            mkdirp( testDir, err => {
                if(err) return done(err);
                store = new Store(testDir);
                done();
            });
        });
    });
    
    it('saving and getting the saved obj', done => {
        const testObject = {name: 'Zac'};
        
        store.save(testObject, (err, savedObject) => {
            if(err) return done(err);
            assert.ok(savedObject._id);
            assert.equal(savedObject.name, testObject.name);
            
            store.get(savedObject._id, (err, objWithId) => {
                if(err) return done(err);
                assert.deepEqual(objWithId, savedObject);
                done();
            });
        });
    });

    it('removed file by id', done => {
        const testObject = {name: 'Zac'};

        store.save(testObject, (err, savedObject) => {
            if(err) return done(err);
            assert.ok(savedObject._id);
            assert.equal(savedObject.name, testObject.name);

            store.remove(testObject._id, (err, removedObj) => {
                assert.deepEqual(removedObj, { removed: true } );
                done();
            });

        });
    });

    it('gets all objects', done => {
        const testObject = {name: 'Zac'};

        store.save(testObject, (err, savedObject) => {
            if(err) return done(err);
            assert.ok(savedObject._id);
            assert.equal(savedObject.name, testObject.name);

            store.getAll((err, files) => {
                if(err) return done(err);
                assert.equal(files.length, 1);
                done();
            });
        });
    });
});