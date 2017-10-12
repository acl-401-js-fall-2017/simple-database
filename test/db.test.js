const MakeDb = require('../lib/db');
const Store = require('../lib/store');
const path = require('path');
const { rimraf, } = require('../lib/promisified');
const assert = require('assert');


describe('db test functions', () =>{
    let db = null;
    const testDir = path.join(__dirname, 'test-file');

    beforeEach( () => {
        return rimraf( testDir)
            .then( () => db = new MakeDb(testDir));
    });

    it('checks for instances of stores', () => {

        return db.getStore('StoreName')
            .then( createdStore => {
                assert.ok(createdStore instanceof Store);

            });
    });

});