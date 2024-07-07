let mongoConnector = require('./mongo-stuff/mongodb-stuff');
let sqliteConnector = require('./sqlite-connector');
let fakeDB = require('./fake-database-connector');
let exportedValue;
if (process.env.NODE_ENV === 'test') {
    exportedValue = fakeDB;
} else if (process.env.SQLITE_URL) {
    exportedValue = sqliteConnector;
} else {
    exportedValue = mongoConnector;
}

module.exports = exportedValue;