const assert = require('assert');
const Store = require('../lib/store.js');
const fs = require('fs');
const rimraf = require('rimraf');
const dbName = (__dirname + '/db');
const storeName = (dbName + '/myStore');


describe('Stores', () => {
    //2 describes because get all is not crud;
    describe('CRUD', () => {
        let myStore = null;
        const thing = { name : 'thing', description : 'a thing'};
        let thingId = null;
        const mountain = { name : 'hood', state : 'Oregon'};

        beforeEach( () => {
            if (fs.existsSync(storeName)) {
                rimraf(storeName, () => {
                    myStore = new Store(storeName);
                });
            } else {
                myStore = new Store(storeName);
            }
            // myStore.save(thing, (err , newObj) => {
            //     if(err) console.error(err);
            //     thingId = newObj._id;
            // });
            // for(let i= 100000; i >0; i--){
            //     //nothing to see here, move along
            // }
        });

        it('saves a new object and assigns it an ID', done => {
            let saved = null;
            myStore.save(mountain, (error, newObj) => {
                if (error) return done(error);
                saved = newObj;
                assert.deepEqual(saved, { name: 'hood', state: 'Oregon', _id : saved._id });
                done();
            });
        });

        it('gets the object with thing ID', done =>{
            myStore.save(thing, (err, newObj) => {
                if (err) console.error(err);
                thingId = newObj._id;
                let gotten = null;
                myStore.get(thingId, (error, newObj) =>{
                    if(error){
                        return done(error);
                    }
                    gotten = newObj;
                    assert.deepEqual(gotten, {  name: 'thing', description: 'a thing' , _id: gotten._id });
                    done();
                });
            });
        });

        it('removes object with given ID {removed : true}', done =>{
            myStore.save(thing, (err, newObj) => {
                if (err) console.error(err);
                thingId = newObj._id;
                let removed = null;
    
                myStore.remove(thingId, (error,status) => {
                    if (error) {
                        return done(error);
                    }
                    removed = status;
                    assert.deepEqual(removed, {removed : true});
                    done();
                });
            });

        });

        it('removes object with given ID { removed: false }', done => {
            myStore.save(thing, (err, newObj) => {
                if (err) console.error(err);
                thingId = newObj._id;
                let removed = null;
                myStore.remove('bad ID', (error, status) => {
                    if (error) {
                        return done(error);
                    }
                    removed = status;
                    assert.deepEqual(removed, { removed: false });
                    done();
                });
            });
        });
    });


});