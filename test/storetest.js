const assert = require('assert');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const store = require('../lib/store'); //should be cap'd?

const rootDirectory = path.join(__dirname, 'data') //replace data when needed

describe('saves file', () => {
    const dataDir = path.join(__dirname, 'dataDir');

    //removing and recreating directory
    beforeEach(done => {
        rimraf( dataDir, err => {
            if(err) return done(err);
            mkdirp(dataDir, err => {
                if(err) return done(err);
            })
        })
        const freshStore = new Store();
    })

    it('saves an object to a file', () => {
        let saved = store.save(object) //change object name?
        assert.ok(saved._id)
    })
})



