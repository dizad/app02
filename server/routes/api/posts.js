//imports
    let express = require('express');
    let mongodb = require('mongodb');
    let router = express.Router();
//database
    //let database = `paylocity`; //paylocity
    //let connectionString = 'mongodb://localhost:27017/' + database; //local
    let database = `paylocity`;
    let connectionString = 'mongodb+srv://paylocity:paylocity1!@cluster.wjhrv.mongodb.net/paylocity?retryWrites=true&w=majority'; //internet

//generics
    //collection
        //get
            router.post('/getCollection', async (req, res) => {
                let collection = await loadCollection(req.body.collection);
                res.send(await collection.find({}).toArray());
            });
        //set
            router.post('/setCollection', async (req, res) => {
            //get collection
                let collection = await loadCollection(req.body.collection);
            //delete all
                await collection.deleteMany({});
            //insert all
                if(req.body.data.length){
                    await collection.insertMany(req.body.data);
                }
            //return
                res.status(201).send();
            });

    //document
        //get
            router.post('/getDocument', async (req, res) => {
            //get params
                let collection = await loadCollection(req.body.collection);
                let query = { _id: req.body._id };
            //build document
                let document = await collection.findOne(query);
            //return
                res.send(document);
            }); 
        //set
            router.post('/setDocument', async (req, res) => {
            //get params
                let collection = await loadCollection(req.body.collection);
                let query = { _id: req.body.item._id };
                let options = { //insert if doesn't exist
                    upsert: true,
                };
            //build document
                let replace = req.body.item;
                await collection.replaceOne(query, replace, options);
            //return
                res.status(201).send();
            }); 

    //field
        //get
            router.post('/getField', async (req, res) => {
            //get params
                let collection = await loadCollection(req.body.collection);
                let query = {};
                query[req.body.matchField] = req.body.matchValue;
            //build document
                let document = await collection.findOne(query);
            //return
                res.send(document[req.body.getField]);
            }); 
        //set
            router.post('/setField', async (req, res) => {
            //get params
                let collection = await loadCollection(req.body.collection);
                let query = {};
                query[req.body.matchField] = req.body.matchValue;
                let field = {};
                field[req.body.setField] = req.body.setValue;
                let update = { $set: field };
                let options = {};
            //build document
                await collection.updateOne(query, update, options);
            //return
                res.status(201).send();
            }); 

//customs
    //get token
        router.post('/getToken', async (req, res) => {
        //build JSON
            let result = {
                validUsername : false,
                validFruit: false,
                privilege: false
            };
        //get collection
            let collection = await loadCollection('users');
        //query
            let user = await collection.findOne({
                username: req.body.username
            });
            if(user){
                result.validUsername = true;
                if(user.fruit == req.body.fruit){
                    result.validFruit = true;
                    result.privilege = user.privilege;
                    result.isEula = user.isEula;
                }
            }
        //return
            res.send(result);
        });

    //get user
        router.post('/getUser', async (req, res) => {
            //get collection
                let collection = await loadCollection('users');
            //query
                let user = await collection.findOne({
                    username: req.body.id
                });
            //return
                res.send(user);
            });

    //get license by user
        router.post('/getLicenseByUser', async (req, res) => {
            //get params
                let collection = await loadCollection('users');
                let user = await collection.findOne({
                    username: req.body.username
                });
            //build document
                collection = await loadCollection('licenses');
                let license = await collection.findOne({
                    license: user.license
                });
            //return
                res.send(license);
            }); 

    //get config
        router.post('/getConfig', async (req, res) => {
        //get params
            let collection = await loadCollection('configs');
            let config = await collection.findOne({
                _id: req.body.config
            });
        //return
            res.send(config);
        }); 
    
    //database
        async function loadCollection(collection){
            let client = await mongodb.MongoClient.connect(connectionString, {
                useNewUrlParser: true
            });
            return client.db(database).collection(collection);
        }

//export
    module.exports = router;