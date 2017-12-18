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

    it('gets all objects', () => {
        const obj = [
            {name: 'Kate'},
            {name: 'David'}
        ];
        let savedObj = null;
        return Promise.all(obj.map(item => store.save(item)))
            .then(_savedObj => {
                savedObj = _savedObj;
                savedObj.sort((x,y) => x._id < y._id ? -1 : 1);
                return store.getAll();
            })
            .then(gotAll => {
                assert.deepEqual(gotAll, savedObj);
            });
    });
});
