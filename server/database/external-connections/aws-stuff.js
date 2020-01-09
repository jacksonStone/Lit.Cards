let AWS = require('aws-sdk');
AWS.config = new AWS.Config({
    apiVersion: '2020-01-01',
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1'
});
// let DynamoDB = new AWS.DynamoDB();
let DynamoDBDocClient = new AWS.DynamoDB.DocumentClient();
let S3 = new AWS.S3();
let tableNames = {
    "test" : {
        "user": "Litcards.Users.Test"
    }
};
let params = {
    Item: {
     "userEmail":'Foo'
    }, 
    TableName: tableNames.test.user
};
/**
 * Transaction example
 * data = await dynamoDb.transactWriteItems({
    TransactItems: [
        {
            Update: {
                TableName: 'items',
                Key: { id: { S: itemId } },
                ConditionExpression: 'available = :true',
                UpdateExpression: 'set available = :false, ' +
                    'ownedBy = :player',
                ExpressionAttributeValues: {
                    ':true': { BOOL: true },
                    ':false': { BOOL: false },
                    ':player': { S: playerId }
                }
            }
        },
        {
            Update: {
                TableName: 'players',
                Key: { id: { S: playerId } },
                ConditionExpression: 'coins >= :price',
                UpdateExpression: 'set coins = coins - :price, ' +
                    'inventory = list_append(inventory, :items)',
                ExpressionAttributeValues: {
                    ':items': { L: [{ S: itemId }] },
                    ':price': { N: itemPrice.toString() }
                }
            }
        }
    ]
}).promise();
 */
DynamoDBDocClient.put(params, function(err, data) {
    if (err) {
        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        DynamoDBDocClient.get({
            TableName: tableNames.test.user,
            Key:{
                "userEmail": 'foo',
            }
        }, function(err, data) {
            if (err) {
                console.error("Unable to get item", JSON.stringify(err, null, 2));
            } else {
                console.log("Got Item:", data);
            }
        });
        console.log("Added item:", data);
    }
});