//Paths in here are relative to the electron/server/database/external-connections.
//This file will get copied over to electron folder - and is only intended
//to be used in an electron context.
let fakeDatabaseConnector = require('../../mocked-data');
let _ = require('lodash')
let fileIO = require('../../../utils/file-io');
let user = {};
async function getRecord (table, conditions, limit) {
  if(table === 'user' || table === 'studyHistory') {
    let recordStr = await fileIO.getFile(table);
    let record = JSON.parse(recordStr);
    console.log(recordStr);
    if(limit === 1) return record;
    return [record];
  }
  if(conditions) {
    delete conditions.userEmail;
  }
  // Should probably do decks first
  if(table !== 'cardBody') {
    let results;
    if (!conditions.id) {
      let deckStrs = await fileIO.getAllFileContentInDir(table);
      decks = deckStrs.map(str => JSON.parse(str));
      results = _.filter(decks, dbEntry => {
        let match = true
        _.each(conditions, (conditionValue, conditionKey) => {
          if (dbEntry[conditionKey] !== conditionValue) {
            match = false
            return false
          }
        })
        return match
      });
    } else {
      let recordResultStr = await fileIO.getFile(`${table}/${conditions.id}`);
      let record = JSON.parse(recordResultStr);
      results = [record];
    }
    if (limit === 1 && results && results.length) {
      return results[0]
    } else if(limit === 1) {
      return;
    } else if(limit) {
      return results.slice(0, limit)
    }
    return results;
  }
  let tableData = fakeDatabaseConnector[table]
  if (!tableData) return
  let results = _.map(
    _.filter(tableData, dbEntry => {
      let match = true
      _.each(conditions, (conditionValue, conditionKey) => {
        if (dbEntry[conditionKey] !== conditionValue) {
          match = false
          return false
        }
      })
      return match
    }), v => {
      return _.cloneDeep(v)
    }
  )

  if (limit === 1 && results && results.length) {
    return results[0]
  } else if(limit === 1) {
    return;
  } else if(limit) {
    return results.slice(0, limit)
  }
  return results
}

async function setRecord (table, values) {
  if(table === 'user') {
    //We don't create users
    throw Error('We don\'t create users in electron');
  }
  if(table === "studyHistory") {
    return editRecord(table, {}, values);
  }
  if (values.userEmail) {
    delete values.userEmail;
  }
  if(table !== 'cardBody') {
    if(!values.id) {
      throw Error("Record creation requires an id field");
    }
    await fileIO.setFile(`${table}/${values.id}`, JSON.stringify(values));
    return values;
  }
  let tableData = fakeDatabaseConnector[table]

  if (!tableData) return
  tableData.push(values)
  return values
}

async function unsetRecord (table, values) {
  if(values) {
    delete values.userEmail
  }
  if(table === 'studyHistory') {
    return editRecord(table, {}, {});
  }
  if(table !== 'cardBody') {
    if(!values.id) {
      const records = await getRecord(table, values);
      return Promise.all(records.map(async record => {
        try {
          await fileIO.unsetFile(`${table}/${record.id}`);
          console.log(`Deleted ${table}, id: ${record.id}`);

        } catch(e) {
          console.log("Deleted non-existence file");
        }
      }));
    }
    try {
      await fileIO.unsetFile(`${table}/${values.id}`);
    } catch(e) {
      console.log("Deleted non-existence file");
    }
    return;
  }

  let tableData = fakeDatabaseConnector[table]
  if (!tableData) return
  fakeDatabaseConnector[table] = _.reject(tableData, values)
}

async function editRecord (table, filter, values) {
  if(table === 'user' || table === 'studyHistory') {
    let record = await getRecord(table, {}, 1);
    if(Object.keys(values).length === 0) {
      record = {};
    } else {
      record = Object.assign(record, values);
    }
    let recordStr = JSON.stringify(record);
    await fileIO.setFile(table, recordStr);
    return values;
  }
  delete filter.userEmail;

  if(table !== 'cardBody' && table !== 'studyHistory') {
    if(!filter.id) {
      const records = await getRecord(table, filter);
      console.log("All records");
      console.log(records);
      return Promise.all(records.map(async record => {
        const newRecord = Object.assign(record, values);
        console.log("Attempting to edit");
        return fileIO.setFile(`${table}/${newRecord.id}`, JSON.stringify(newRecord));
      }));
    } else {
      const recordStr = await fileIO.getFile(`${table}/${filter.id}`);
      const record = Object.assign(JSON.parse(recordStr), values);
      return fileIO.setFile(`${table}/${record.id}`, JSON.stringify(record));
    }
  }

  let tableData = fakeDatabaseConnector[table]
  if (!tableData) return
  let entries = _.filter(tableData, filter)
  console.log("Entries to modify: ", entries.length);
  console.log(filter, values);
  for (let i = 0; i < entries.length; i++) {
    let entry = entries[i]
    Object.assign(entry, values)
    console.log("New Entry", entry.front);
  }
}
module.exports = { getRecord, setRecord, unsetRecord, editRecord }
