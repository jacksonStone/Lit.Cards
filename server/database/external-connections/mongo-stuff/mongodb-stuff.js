const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
let database = [];
let clients = [];
let connectionToUse = 0;
async function connectToDatabase() {
    console.log("Connecting to DB...");
    return Promise.all([0,1,2].map(i =>{
      return new Promise((resolve, reject)=> {
        MongoClient.connect(process.env.MONGO_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true }, (err, c) => {
            if(err) {
                console.log("Unable to connect!", err);
                reject(err);
                return;
            }
            clients.push(c);
            database.push(c.db(process.env.MONGO_DATABASE_NAME));
            console.log("Connected to Mongo successfully!");
            resolve();
        });
    })}));
}
function getDB(){
    let toRet = database[connectionToUse];
    connectionToUse++;
    connectionToUse = connectionToUse % 3;
    return toRet
}
async function setRecord(table, values) {
    let database = getDB();
    if(!database) { await connectToDatabase(); database = getDB()};
    let collection = database.collection(table);
    return new Promise((resolve, reject) => {
        collection.insertOne(values, (err) => {
            if(err) {
                console.log('error creating record!', err);
                reject(err);
            } else {
                resolve(values);
            }
        });
    })
}
async function unsetRecord(table, filter = {NOOP: "NOOP"}) {
    if(Object.keys(unsetRecord).length === 0 && process.env.NODE_ENV !== 'development') {
        return; //Probably unintentional
    }
    let database = getDB();
    if(!database) {await connectToDatabase(); database = getDB()};
    let collection = database.collection(table);
    return new Promise((resolve, reject) => {
        collection.deleteMany(filter, (err) => {
            if(err) {
                console.log('error removing records!', err);
                reject(err);
            } else {
                resolve();
            }
        });
    })
}
async function getRecord(table, filter, limit) {
    assert(limit === 1 || !limit)
    let database = getDB();
    if(!database) {await connectToDatabase(); database = getDB()};
    let collection = database.collection(table);
    if(limit === 1) {
        let now = Date.now();
        return new Promise((resolve, reject) => {
            collection.findOne(filter, (err, data) => {
                let time = Date.now() - now;
                console.log(...arguments, time);
                if(err) {
                    console.log('error getting record!', err);
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        })
    }
    return new Promise((resolve, reject) => {
        collection.find(filter).toArray((err, data) => {
            if(err) {
                console.log('error getting records!', err);
                reject(err);
            } else {
                resolve(data);
            }
        });
    })
}

async function editRecord (table, filter, values) {
    let database = getDB();
    if(!database) {await connectToDatabase(); database = getDB()};
    let collection = database.collection(table);
    return new Promise((resolve, reject) => {
        collection.updateOne(filter, {$set: values}, (err) => {
            if(err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

// (async () => {
//     if(!database) await connectToDatabase();
//     let now = Date.now();
//     let res = await getRecord('user', {userEmail: 'jacksonastone@gmail.com'}, 1)
//     let finish = Date.now() - now;
//     console.log(res, finish);
//     client.close();
// })();

module.exports = { getRecord, setRecord, unsetRecord, editRecord, connectToDatabase }
