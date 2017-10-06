const assert = require('assert');
const Store = require('../lib/store.js');
const Db = require('../lib/db.js');
const fs = require('fs');


// console.log('DIRNAME', __dirname);
// console.log('FILENAME', __filename);

describe('DataBase', () =>{

    let freshDB = null;
    beforeEach( done => {
        freshDB = new  Db(__dirname, done);
    });

    it('returns an DB object',() =>{
        assert.ok(freshDB instanceof  Db);
    });

    it('creates a file', () => {
        assert.ok(fs.existsSync(__dirname + '/db'));
    });

});