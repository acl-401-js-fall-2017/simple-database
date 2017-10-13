const assert = require('assert');
const promisify = require('util').promisify;
const rimraf = promisify(require('rimraf'));
const mkdirp = promisify(require('mkdirp'));
const Store = require('../lib/store');
const path = require('path');

describe('create storeDir name', () => {
    let store = null;
    const testDir = path.join(__dirname, 'data');

    // clear any instances of Store and make new file prior to running each test
    beforeEach(() => {
        return rimraf(testDir)
            .then(() => mkdirp(testDir))
            .then(() => store = new Store(testDir));
    });
    
    it('gets a saved obj', () => {
        let savedObj = null;
        let obj = {name: 'Kate'};

        return store.save(obj)
            .then(_savedObj => {
                savedObj = _savedObj;
                assert.ok(savedObj._id);
                assert.equal(savedObj.name, obj.name);

                // .get reads the contents of this file
                return store.get(savedObj._id)
                    .then(gotObjWithId => {
                        assert.deepEqual(gotObjWithId, savedObj);
                    });
            });
    });


    it('removes files by id', () => {
        let savedObj = null;
        let obj = {name: 'Kate'};
        
        store.save(obj)
            .then(_savedObj => {
                savedObj = _savedObj;
                return store.remove(obj._id)
                    .then(removedObj => {
                        assert.deepEqual(removedObj, { removed: true });
                        return store.get(obj._id);
                    })
                    .then(noObj => {
                        assert.equal(noObj, savedObj);
                    });
            });
    });


    it.skip('gets and returns an array of all files', done => {
        const obj = {name: 'Kate'};
        
        store.save(obj, (err, savedObj) => {
            if(err) return done(err);
            assert.ok(savedObj._id);
            assert.equal(savedObj.name, obj.name);

            store.getAll((err, allFiles) => {
                if(err) return done(err);
                assert.equal(allFiles.length, 1);
                done();
            });
        });  
    });    
});