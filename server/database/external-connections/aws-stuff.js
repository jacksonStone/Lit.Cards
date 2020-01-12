let AWS = require('aws-sdk');
AWS.config = new AWS.Config({
    apiVersion: '2020-01-01',
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1'
});
let PROD = process.env.NODE_ENV === 'production';
// let DynamoDB = new AWS.DynamoDB();
let DynamoDBDocClient = new AWS.DynamoDB.DocumentClient();
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
        if(key !== keyField) {
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
    updateExpression

    let params = {
        Key: {
            [keyField]:filter[keyField]
        },
        ExpressionAttributeValues:EAV,
        ExpressionAttributeNames: EAN,
        UpdateExpression: updateExpression,
        ConditionExpression: conditionExpression,
        TableName: PROD ? tableNames.prod[table] : tableNames.test[table],
    };

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

editRecord('deck', {userEmail: 'foo@gmail.com', id: 'foo'}, {"Boo": "Goo", userEmail: 'foo@gmail1.com',});