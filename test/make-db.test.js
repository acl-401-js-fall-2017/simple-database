const assert = require('assert');
const Db = require('../lib/make-db');
const path = require('path');
const Store = require('../lib/store');
const { rimraf } = require('../lib/fsp');

describe('create root directories', () => {
    let db = null;
    const testRootDir = path.join(__dirname, 'test-file');

    beforeEach(() => {
        return rimraf(testRootDir)
            .then(() => db = new Db(testRootDir));
    });

    it('checks for instances of Store', () => {
        return db.getStore('storeName') 
            .then(checkedStore => {
                assert.ok(checkedStore instanceof Store);
            });
    });
});
