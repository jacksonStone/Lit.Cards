let AWS = require('aws-sdk');
AWS.config = new AWS.Config({
    apiVersion: '2020-01-01',
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1'
});
let DynamoDB = new AWS.DynamoDB();
let S3 = new AWS.S3();
let params = {
    Item: {
     "userEmail": {S: 'Foo'}
    }, 
    ReturnConsumedCapacity: "TOTAL", 
    TableName: "Litcards_test_users"
};
DynamoDB.putItem(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
    /*
    data = {
        ConsumedCapacity: {
        CapacityUnits: 1, 
        TableName: "Music"
        }
    }
*/
});