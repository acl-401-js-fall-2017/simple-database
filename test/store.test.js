const assert = require('assert');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const Store = require('../lib/store');
const path = require('path');

describe.only('create storeDir name', () => {
    let store = null;
    const testDir = path.join(__dirname, 'data');
    
    beforeEach(done => {
        rimraf(testDir, err => {
            if(err) return done(err);
            mkdirp(testDir, err => {
                if(err) return done(err);
                store = new Store(testDir);
                done();
            });
        });
    });
    
    it('gets a saved obj', done => {
        const obj = {name: 'Kate'};

        store.save(obj, (err, savedObj) => {
            if(err) return done(err);
            assert.ok(savedObj._id);
            assert.equal(savedObj.name, obj.name);

            // .get reads the contents of this file
            store.get(savedObj._id, (err, gotObjWithId) => {
                if(err) return done(err);
                assert.deepEqual(gotObjWithId, savedObj);
                done();
            });
        });
    });

    it('removes files by id', done => {
        const obj = {name: 'Kate'};
        
        store.save(obj, (err, savedObj) => {
            if(err) return done(err);
            assert.ok(savedObj._id);
            assert.equal(savedObj.name, obj.name);

            store.remove(obj._id, (err, removedObj) => {
                assert.deepEqual(removedObj, { removed: true });
                done();
            });
        });
    });
});