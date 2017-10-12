
const Db = require('../lib/Db');
const Store = require('../lib/Store');
const chai = require('chai');
const assert = chai.assert;
const path = require('path');
const fs = require('fs');

const {promisify} = require('util');
const rimrafAsync = promisify(require('rimraf'));
const readFileAsync = promisify(fs.readFile);
const mkdirAsync = promisify(fs.mkdir);

const dbPath = path.join(__dirname, 'testDb');

describe('DB', () => {
    let testDb = null;

    before(() => {
        testDb = new Db(dbPath);
    });

    after(() => {
        return rimrafAsync(dbPath)
            .then(() => {
                return mkdirAsync(dbPath);
            });
    });

    describe('Constructor', () => {
        it('creates a Db object with a store', () => {
            assert.ok(testDb instanceof Db);
        });
    });


});