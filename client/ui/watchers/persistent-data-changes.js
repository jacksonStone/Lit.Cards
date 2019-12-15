let { each } = require('utils')
let { handleTransaction } = require('logic/handle-transaction');

function listenToSaveableChanges () {
  let runningAlready = false
  setInterval(() => {
    if (runningAlready || !window.lc.hasPersistentChanges()) {
      return
    }
    runningAlready = true

    // TODO:: Maybe do something more intelligent here
    _handleChanges().then(() => {
      runningAlready = false
    }).catch(() => {
      runningAlready = false
    })
  }, 20);
}
async function _handleChanges () {
  window.lc.transaction_debug = window.lc.transaction_debug || {};
  let changeObj = window.lc.getPersistentChanges()
  let transaction = JSON.parse(JSON.stringify(changeObj));
  window.lc.setSaving(true);
  window.lc.flushPersistentChanges()
  await _handleTransaction(transaction);
  window.lc.setSaving(false);
}

async function _handleTransaction(transaction) {
  if (transaction.cardBody) {
    each(transaction.cardBody, (cardBody, cardId) => {
      if(cardBody.isNew && cardBody.isDeleted) {
        delete transaction.cardBody[cardId];
      }
    });
    if(Object.keys(transaction.cardBody).length === 0) {
      delete transaction.cardBody;
      if(Object.keys(transaction).length === 0) {
        //transaction was a no-op
        return;
      }
    }
  }
  return handleTransaction(transaction);
}

module.exports = listenToSaveableChanges
