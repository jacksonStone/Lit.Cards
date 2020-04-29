let mongoConnector = require('./mongo-stuff/mongodb-stuff');
let fakeDB = require('./fake-database-connector');
let exportedValue;
let isElectron = require('../../node-abstractions/is-electron');
if (isElectron()) {
    exportedValue = require('./electron-file-system-connector');
} else if(process.env.NODE_ENV === 'test') {
    exportedValue = fakeDB;
} else {
    exportedValue = mongoConnector;
}

module.exports = exportedValue;
