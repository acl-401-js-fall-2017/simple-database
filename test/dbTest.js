const assert = require('assert');
const Store = require('../lib/store.js');
const Db = require('../lib/db.js');
const fs = require('fs');
const rimraf = require('rimraf');
const dbName = (__dirname + '/db');

// console.log('DIRNAME', __dirname);
// console.log('FILENAME', __filename);

describe('DataBase', () =>{

    let freshDB = null;

    //this checks to see if file exist, if exists delete to make a new one
    before( done => {
        console.log('log test 1  ' +  fs.existsSync(dbName));
        if (fs.existsSync(dbName)){
            rimraf(dbName, () => {
                console.log('this is db name  ' + dbName);
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

});