let mongoConnector = require('./mongo-stuff/mongodb-stuff');
let fakeDB = require('./fake-database-connector');
let exportedValue;
if(process.env.NODE_ENV === 'test') {
    exportedValue = fakeDB;
} else {
    exportedValue = mongoConnector;
}

module.exports = exportedValue;