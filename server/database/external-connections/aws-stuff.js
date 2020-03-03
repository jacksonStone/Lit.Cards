let AWS = require('aws-sdk');
let assert = require('assert');
AWS.config = new AWS.Config({
    apiVersion: '2020-01-01',
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1'
});
let PROD = process.env.NODE_ENV === 'production';
// let DynamoDB = new AWS.DynamoDB();
let DynamoDBDocClient = new AWS.DynamoDB.DocumentClient({
    paramValidation: false,
    convertResponseTypes: false
});
let S3 = new AWS.S3();
let tableNames = {
    "test" : {
        "user": "Litcards.Users.Test",
        "deck": "Litcards.Decks.Test"
    }
};
function mapObj(obj, callback) {
    let keys = Object.keys(obj);
    for(let key of keys) {
        callback(obj[key], key);
    }
}
async function editRecord (table, filter, values) {
    let keyField = 'id';
    if(table === 'user') {
        keyField = 'userEmail'
    }
    let EAV = {};
    let EAN = {};
    let updateExpression = 'SET ';
    let conditionExpression = '';
    mapObj(filter, (value, key) => {
        if(key !== keyField && key !== 'userEmail') {
            EAV[':f'+key] = value;
            EAN['#f'+key] = key;
            if(conditionExpression) {
                conditionExpression+=' AND '
            }
            conditionExpression+=`#f${key} = :f${key}`;
        }
    });
    let firstValue = true;
    mapObj(values, (value, key) => {
        if(key !== keyField) {
            EAV[':v'+key] = value;
            EAN['#v'+key] = key;
            if(!firstValue) {
                updateExpression+=', ';
            }
            else {
                firstValue = false;
            }
            updateExpression+=`#v${key} = :v${key}`;
        }
    });
    let keyExpression;
    if(table === 'user') {
        keyExpression = {
            [keyField]:filter[keyField],
        }
    } else {
        //Whenever we update we want both id and userEmail
        if(!filter.userEmail) {
            return
        }
        keyExpression = {
            [keyField]:filter[keyField],
            userEmail: filter.userEmail
        }
    }
    let params = {
        Key: keyExpression,
        ExpressionAttributeValues:EAV,
        ExpressionAttributeNames: EAN,
        UpdateExpression: updateExpression,
        TableName: PROD ? tableNames.prod[table] : tableNames.test[table],
    };
    if(conditionExpression) {
        params.ConditionExpression = conditionExpression;
    }
    console.log(params);

    return new Promise((resolve, reject) => {
        DynamoDBDocClient.update(params, function(err, data) {
            if (err) {
                //TODO:: Error reporting
                console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                reject();
            } else {
                console.log("Added item:", data);
                resolve();
            }
        });
    })
}
async function getDeckRecords(conditions, limit) {
    const keyField = 'id';
    const sortKey = 'userEmail';
    if(conditions[keyField] && conditions[sortKey]) {
        // GetItem
        return new Promise((resolve) => {
            DynamoDBDocClient.get({
                Key: {
                    [keyField]:conditions[keyField],
                    [sortKey]: conditions[sortKey]
                },
                TableName: PROD ? tableNames.prod['deck.ts.ts'] : tableNames.test['deck']
            }, (err, data) => {
                if(err) {
                    console.log(err);
                    return resolve(limit === 1 ? undefined : []);
                }
                data = data.Item;
                //Now validate other search criteria
                let keys = Object.keys(conditions);
                if(keys.length > 2) {
                    for(let key of keys) {
                        if(data[key] !== conditions[key]) {
                            return resolve(limit === 1 ? undefined : []);
                        }
                    }
                }
                resolve(limit === 1 ? data : [data]);
            });
        });

    }
    else if(conditions[keyField] || conditions[sortKey]) {
        return new Promise((resolve) => {
            //query
            let EAV = {};
            let EAN = {};
            let keyExpression = ''
            mapObj(conditions, (value, key) => {

                if(key !== keyField && key !== sortKey) {
                //Unnecessary
                return;
                } else {
                    EAV[':f'+key] = value;
                    EAN['#f'+key] = key;
                    if(keyExpression) {
                        keyExpression+=' AND '
                    }
                    keyExpression+=`#f${key} = :f${key}`;
                }
            });
            let params = {
                KeyConditionExpression: keyExpression,
                ExpressionAttributeValues:EAV,
                ExpressionAttributeNames: EAN,
                // ConditionExpression: conditionExpression,
                TableName: PROD ? tableNames.prod['deck.ts.ts'] : tableNames.test['deck'],
            };
            DynamoDBDocClient.query(params, (err, data) => {
                console.log(err, data);
                resolve();
            })
        })
        // Query
    } else {
        // Scan
    }
}
async function getRecord (table, conditions, limit) {
    if(table === 'deck.ts.ts') {
        return getDeckRecords(conditions, limit)
    }
    if(table === 'user') {
        if(conditions.userEmail) {
            // GetItem
            return new Promise((resolve) => {
                DynamoDBDocClient.get({
                    Key: {
                        userEmail:conditions.userEmail,
                    },
                    TableName: tableNames.test.user
                }, (err, data) => {
                    if(err) {
                        console.log(err);
                        return resolve(limit === 1 ? undefined : []);
                    }
                    data = data.Item;
                    resolve(data);
                });
            });

        }
        else {
            // Scan
        }
    }

//     let tableData = fakeDatabaseConnector[table]
//     if (!tableData) return
//     let results = _.map(
//       _.filter(tableData, dbEntry => {
//         let match = true
//         _.each(conditions, (conditionValue, conditionKey) => {
//           if (dbEntry[conditionKey] !== conditionValue) {
//             match = false
//             return false
//           }
//         })
//         return match
//       }), v => {
//         return _.cloneDeep(v)
//       }
//     )
//     if (limit) {
//       return results.slice(0, limit)
//     }
//     return results
  }

  async function setRecord (table, newRecord) {
    // let tableData = fakeDatabaseConnector[table]
    // if (!tableData) return
    // tableData.push(values)
    // return values
  }

  async function unsetRecord (table, deleteFilter) {

    // let tableData = fakeDatabaseConnector[table]
    // if (!tableData) return
    // fakeDatabaseConnector[table] = _.reject(tableData, values)
  }
(async () => {
    // await editRecord('user', { userEmail: 'foo@email.com' }, {"Boo": "Goo"});
    await getRecord('user', {userEmail: 'foo@email.com'}, 1)
    let before = Date.now();
    const res = await getRecord('user', {userEmail: 'foo@email.com'}, 1);
    let time = Date.now() - before;
    console.log(time, res);
})();
