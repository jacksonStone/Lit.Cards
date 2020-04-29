//Paths in here are relative to the electron/server/database/external-connections.
//This file will get copied over to electron folder - and is only intended
//to be used in an electron context.
let fakeDatabaseConnector = require('../../mocked-data');
let _ = require('lodash')
let fileIO = require('../../../utils/file-io');


let encodeId = (id) => {
  const encoded = encodeURIComponent(id);
  return encoded.replace('\\', 'UU');
}

async function getRecord (table, conditions, limit) {
  let results;

  if(conditions) {
    delete conditions.userEmail;
  }

  if(table === 'user' || table === 'studyHistory') {
    let recordStr = await fileIO.getFile(table, true);
    if(!recordStr) {
      results = [];
    } else {
      let record = JSON.parse(recordStr);
      results = [record];
    }
  }

  if(table === 'cardBody') {
    if(!conditions.deck) {
      throw Error('Card queries must specify a deck');
    }
    if (!conditions.id) {
      let cardBodyStrs = (await fileIO.getAllFileContentInDir(`${table}/${conditions.deck}`, true)).filter(str => {
        return !!str;
      });
      let cardBodies = cardBodyStrs.map(str => JSON.parse);
      if(Object.keys(conditions).length > 1) {
        cardBodies = _.filter(cardBodies, conditions);
      }
      results = cardBodies;
    } else {
      let uriEncodedId = encodeId(conditions.id);
      let cardBodyStr = await fileIO.getFile(`${table}/${conditions.deck}/${uriEncodedId}`, true);
      if (cardBodyStr) {
        let cardBody = JSON.parse(cardBodyStr);
        results = [cardBody];
      } else {
        results = [];
      }
    }
  }

  if(!(table === 'user' || table === 'studyHistory' || table === 'cardBody')) {
    if (!conditions.id) {
      let recordResultStrs = await fileIO.getAllFileContentInDir(table, true);
      let records = recordResultStrs.filter(Boolean).map(str => JSON.parse(str));
      results = _.filter(records, conditions);
    } else {
      let recordResultStr = await fileIO.getFile(`${table}/${conditions.id}`, true);
      if(!recordResultStr) {
        results = [];
      } else {
        let record = JSON.parse(recordResultStr);
        results = [record];
      }

    }
  }

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

  if (values.userEmail) {
    delete values.userEmail;
  }

  if(table === "studyHistory") {
    await editRecord(table, {}, values);
    return values;
  } else {
    if(!values.id) {
      throw Error("Record creation requires an id field");
    }
  }

  if(table !== 'cardBody') {
    await fileIO.setFile(`${table}/${values.id}`, JSON.stringify(values));
  } else {
    const exists = await fileIO.pathExists(`${table}/${values.deck}`);
    if (!exists) {

      await fileIO.createDir(`${table}/${values.deck}`);
    }
    //Cardbodies are grouped by deckId/cardId
    await fileIO.setFile(`${table}/${values.deck}/${encodeId(values.id)}`, JSON.stringify(values));
  }

  return values
}

async function unsetRecord (table, values) {
  if(table === 'user') {
    throw Error('Cannot delete user record in electron');
  }
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

        } catch(e) {
        }
      }));
    }
    try {
      await fileIO.unsetFile(`${table}/${values.id}`);
    } catch(e) {
    }
    return;
  } else {
    //cardBodies
    if(!values.deck) {
      throw Error("Deck required for delete card bodies");
    }
    if(!values.id) {
      let deck;
      const records = await getRecord(table, values);
      await Promise.all(records.map(async record => {
        try {
          deck = record.deck;
          await fileIO.unsetFile(`${table}/${record.deck}/${encodeId(record.id)}`);
        } catch(e) {
        }
      }));
      const files = await fileIO.getDirFiles(`${table}/${deck}`, true);
      if(files && !files.length) {
        //Remove dir - keep it clean.
        await fileIO.removeDir(`${table}/${deck}`, true)
      }
    } else {
      await fileIO.unsetFile(`${table}/${values.deck}/${encodeId(values.id)}`);
    }
  }
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

  if (table !== 'cardBody') {
    if(!filter.id) {
      const records = await getRecord(table, filter);
      return Promise.all(records.map(async record => {
        const newRecord = Object.assign(record, values);
        return fileIO.setFile(`${table}/${newRecord.id}`, JSON.stringify(newRecord));
      }));
    } else {
      const recordStr = await fileIO.getFile(`${table}/${filter.id}`);
      const record = Object.assign(JSON.parse(recordStr), values);
      return fileIO.setFile(`${table}/${record.id}`, JSON.stringify(record));
    }
  }
  if (table === 'cardBody') {
    if(!filter.id) {

      const records = await getRecord(table, filter);
      return Promise.all(records.map(async record => {
        const newRecord = Object.assign(record, values);
        return fileIO.setFile(
          `${table}/${record.deck}/${encodeId(newRecord.id)}`,
          JSON.stringify(newRecord)
        );
      }));
    } else {
      const recordStr = await fileIO.getFile(`${table}/${filter.deck}/${encodeId(filter.id)}`);
      const record = Object.assign(JSON.parse(recordStr), values);
      return fileIO.setFile(`${table}/${record.deck}/${encodeId(record.id)}`, JSON.stringify(record));
    }
  }
}

module.exports = { getRecord, setRecord, unsetRecord, editRecord }
