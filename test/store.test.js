const assert = require('assert');
// const promisify = require('util').promisify;
const { rimraf, mkdirp } = require('../lib/fsp');
const Store = require('../lib/store');
const path = require('path');

describe('create storeDir name', () => {
    let store = null;
    const testDir = path.join(__dirname, 'test-file');

    beforeEach(() => {
        return rimraf(testDir)
            .then(() => mkdirp(testDir))
            .then(() => store = new Store(testDir));
    });

    it('gets a saved obj', () => {
        let savedObj = null;
        let obj = { name: 'Kate' };

        store.save(obj)
            .then(_savedObj => {
                savedObj = _savedObj;

                assert.ok(savedObj._id);
                assert.equal(savedObj.name, obj.name);

                return store.get(savedObj._id);
            })
            .then(gotObjWithId => {
                assert.deepEqual(gotObjWithId, savedObj);
            });
    });

    it('removes files by id', () => {
        let savedObj = null;
        let obj = { name: 'Kate' };

        return store.save(obj)
            .then(_savedObj => {
                savedObj = _savedObj;
                return store.remove(savedObj._id);
            })
            .then(removedObj => {
                assert.deepEqual(removedObj, { removed: true });
                return store.get(savedObj._id);
            })
            .then(savedObj => {
                assert.equal(savedObj, null);
            });
    });

    it('tests for no id', () => {
        return store.remove('no id')
            .then(status => {
                assert.deepEqual(status, { removed: false });
            });
    });

    // it.only('gets and returns an array of all files', () => {
    //     const obj1 = { name: 'Kate' };
    //     const obj2 = { name: 'David' };

    //     const saveArr = [store.save(obj1), store.save(obj2)];
    //     let savedObjArr = null;

    //     return Promise.all(saveArr.map(item => store.save(item)))
    //         .then(_savedObjArr => {
    //             savedObjArr = _savedObjArr;
    //             return store.getAll();
    //         })
    //         .then(gotAllArr => {
    //             gotAllArr.sort();
    //             savedObjArr.sort();
    //             assert.deepEqual(gotAllArr, savedObjArr);
    //         });
    // });
});
