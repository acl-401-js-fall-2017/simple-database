const assert = require('assert');
const Store = require('../lib/store.js');
const Db = require('../lib/db.js');
const fs = require('fs');
const rimraf = require('rimraf');
const dbName = (__dirname + '/db');


describe('DataBase', () =>{

    let freshDB = null;

    //this checks to see if file exist, if exists delete to make a new one
    before( done => {
        if (fs.existsSync(dbName)){
            rimraf(dbName, () => {
                freshDB = new  Db(__dirname, done);
            });
        } else {
            freshDB = new Db(__dirname, done);
        }
    });

    it('returns an DB object',() =>{
        assert.ok(freshDB instanceof  Db);
    });

    it('creates a file', () => {
        assert.ok(fs.existsSync(dbName));
    });

    it('creates a store & gives a directory',(done) =>{
        freshDB.getStore('animals',(err, newStore) =>{
            assert.ok(fs.existsSync(newStore.dir));
            done();
        });
    });

});