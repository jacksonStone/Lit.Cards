const MongoClient = require("mongodb").MongoClient;
let db;
let client;
async function connectToDatabase() {
    return new Promise((resolve, reject)=> {
        MongoClient.connect(process.env.MONGO_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true }, (err, c) => {
            client = c;
            if(err) {
                console.log("Unable to connect!", err);
                reject(err);
                return;
            }
            db = client.db(process.env.MONGO_DATABASE_NAME);
            resolve();
        });
    })
}
(async () => {
    let tablesWithIndexes = {
        user: [
            {i:{userEmail: 1}, o: {unique: true}, name: 'user userEmail'}
        ],
        deck: [
            {i:{userEmail : 1, id: 1}, o: {unique: true}, name: 'deck userEmail-id'}, 
            {i:{userEmail : 1}, name: 'deck userEmail'},
            {i:{id : 1},  o: {unique: true}, name: 'deck id'}
        ],
        cardBody: [
            {i:{ deck: 1, id: 1}, o: {unique: true}, name: 'cardBody deck-id'}, 
        ],
        studyHistory: [
            {i:{userEmail : 1}, o: {unique: true}, name: 'studyHistory userEmail'}, 
        ],
        studySession: [
            {i:{userEmail : 1, deck: 1}, name: 'studySession userEmail-deck'}, 
            {i:{userEmail : 1, deck: 1, id: 1}, o: {unique: true}, name: 'studySession userEmail-deck-id'}, 
        ],
    }
    const tables = Object.keys(tablesWithIndexes);
    await connectToDatabase();
    for(let table of tables) {
        for(let index of tablesWithIndexes[table]) {
            await new Promise((resolve, reject) => {
                console.log("Creating index: " + index.name);
                function finished(err, data) {
                    if(err) {
                        console.log(err);
                        reject(err);
                        return;
                    }
                    resolve();
                }
                let options = Object.assign({name: index.name}, index.o || {});
                db.createIndex(table, index.i, options, finished);
            })
        }
    }
    client.close();
})();
