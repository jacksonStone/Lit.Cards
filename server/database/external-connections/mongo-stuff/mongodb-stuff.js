const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
let database;
// let clients;
// let connectionToUse = 0;
const DB_OPTIONS = {
    useNewUrlParser: true, 
    useUnifiedTopology: true
};
async function connectToDatabase() {
    // console.log the stack trace
    console.log("Connecting to DB!!...");
    console.log(new Error().stack);

    return new Promise((resolve, reject)=> {
        MongoClient.connect(process.env.MONGODB_URI, DB_OPTIONS, (err, c) => {
            if(err) {
                console.log("Unable to connect!", err);
                setTimeout(() => {
                    console.log("Trying agin...");
                    connectToDatabase()
                }, 5000);
                reject(err);
                return;
            }
            client = c;
            client.on('close', () => {
                console.log("Connection closed!");
                connectToDatabase()
            });
            client.on('error', () => {
                console.log("Connection ERROR!");
                connectToDatabase()
            });
            database = client.db(process.env.CARDS_MONGO_DATABASE_NAME);
            console.log("Connected to Mongo successfully!");
            resolve();
        });
    })
}
async function setRecord(table, values) {
    if(!database) await connectToDatabase();
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
    if(!database) await connectToDatabase();
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
//TODO:: You are here. Let's try to get it zippy
// Did not work, still gets whole doc
// function getRecordStream(table, filter) {
//     let collection = database.collection(table);
//     return collection.find(filter).stream();
// }
async function getRecord(table, filter, limit) {
    assert(limit === 1 || !limit)
    if(!database) await connectToDatabase();
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
    if(!database) await connectToDatabase();
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

module.exports = { getRecord, setRecord, unsetRecord, editRecord, connectToDatabase }
