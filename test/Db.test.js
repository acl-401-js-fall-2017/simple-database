
const Db = require('../lib/Db');
const Store = require('../lib/Store');
const chai = require('chai');
const assert = chai.assert;
const path = require('path');
const fs = require('fs');

const {promisify} = require('util');
const rimrafAsync = promisify(require('rimraf'));
const mkdirAsync = promisify(fs.mkdir);
const readDirAsync = promisify(fs.readdir);


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

    describe('getStore method', () => {
        it('creates a Store object and creates/assigns it a directory', () => {
            const getStoreArr = [
                testDb.getStore('disneyMovs'),
                testDb.getStore('target')
            ];
            return Promise.all(getStoreArr)
                .then(newStoreArr => {
                    newStoreArr.forEach(store => {
                        assert.ok(store instanceof Store);
                    });
                    return readDirAsync(testDb.path);
                })
                .then(storeArr => {
                    assert.ok(
                        storeArr.includes('disneyMovs') &&
                        storeArr.includes('target')
                    );
                });
        });
    });
});