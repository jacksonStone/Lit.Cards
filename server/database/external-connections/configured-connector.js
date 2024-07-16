let exportedValue;
if (process.env.NODE_ENV === 'test') {
    exportedValue = require('./fake-database-connector');
} else if (process.env.SQLITE_URL) {
    exportedValue = require('./sqlite-connector');
} else {
    exportedValue = require('./mongo-stuff/mongodb-stuff');
}

module.exports = exportedValue;