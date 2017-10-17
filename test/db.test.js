const assert = require('assert');
const promisify = require('util').promisify;
const MakeDB = require('../lib/make-db');
const path = require('path');
const rootDirectory = path.join(__dirname, 'data');
const rimraf = promisify(require('rimraf'));
const {readdir} = require('../lib/fsp');
const Store = require('../lib/store');



describe('make dB', () => {
    const DB = new MakeDB(rootDirectory);
    let store = null;  //eslint-disable-line
    beforeEach( () => {
        return rimraf(rootDirectory)
            .then (() => {
                return DB.getStore('testerSHane');
            })
            .then ((theStore) => {
                store = theStore;
            });
    });

    it('getStore should return an instance of the store', () => {
        return DB.getStore('animals')
            .then((newStore) => {
                assert(newStore instanceof Store);
                assert.deepEqual(newStore.directory, path.join(rootDirectory, 'animals'));
            });
    });
   


    it('should create two store instances on unique paths', () => {
        return DB.getStore('michele')
            .then(() => {
                return readdir(DB.rootDir)
                    .then((dirNames) => {
                        assert.deepEqual(dirNames, ['michele', 'testerSHane']);
                    });
            });
    });

});