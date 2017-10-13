const assert = require('assert');
const path = require('path');
const { rimraf, mkdirp } = require('../lib/promisified');

const Store = require('../lib/store');

describe('creating store dir', () => {
    let store = null;
    const testDir = path.join(__dirname, 'test-file');
    
    beforeEach( () => {
        return rimraf( testDir )
            .then( () => mkdirp(testDir))
            .then( () => store = new Store(testDir));
    });
    
    it('saving and getting the saved obj', () => {
        let savedObject = null;
        let testObject = {name: 'Zac'};

        store.save(testObject)
            .then(_savedObject => {
                savedObject = _savedObject;

                assert.ok(savedObject._id);
                assert.equal(savedObject.name, testObject.name);

                return store.get(savedObject._id);
            })
            .then(objWithId => {
                assert.deepEqual(objWithId, savedObject);

            });
    });

    it('returns null for bad id', () => {
        return store.get('bad id')
            .then((item) => {
                assert.strictEqual(item, null);
            });
    });

    it('removed file by id', () => {
        const testObject = {name: 'Zac'};
        let savedObject = null;

        return store.save(testObject)
            .then(_savedObject => {
                savedObject = _savedObject;
                return store.remove(savedObject._id);
            })
            .then( removedObj => {
                assert.deepEqual(removedObj, { removed: true } );
                return store.get(savedObject._id);
            })
            .then( savedObject => {
                assert.strictEqual(savedObject, null);
            });
    });

    it('returns false when no id', () => {
        return store.remove('bad id')
            .then( status => {
                assert.deepEqual( status, { removed: false });
            });
    });

    it('returns empty array', () => {
        return store.getAll()
            .then(items => {
                assert.deepEqual(items, []);
            });
    });

    it('gets all objects', () => {
        const testObjects = [
            {name: 'Zac'},
            {name: 'Sandy'},
            {name: 'Ted'}
        ];
        let savedObjects = null;
        return Promise.all(testObjects.map(item => store.save(item)))
            .then(_savedObjects => {
                savedObjects = _savedObjects;
                savedObjects.sort((x,y) => x._id < y._id ? -1 : 1);
                return store.getAll();
            })
            .then(gotAll => {
                assert.deepEqual(gotAll, savedObjects);
            });
    });
});