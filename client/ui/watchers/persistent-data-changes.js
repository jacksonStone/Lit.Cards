import { each } from 'utils';
import { handleTransaction } from 'logic/handle-transaction';

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
  //Clean no-ops
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

  let firstTry = true;
  let success = false;
  while(!success) {
    if (!firstTry) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else { firstTry = false; }
    try {
      let res = await handleTransaction(transaction);
      return res;
    } catch(e) {
      console.log(e);
    }
  }
  
}

export default listenToSaveableChanges;
