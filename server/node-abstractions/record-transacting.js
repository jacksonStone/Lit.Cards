module.exports = async function (asyncCallback) {
    if(global.freezeTransactions) {
        throw Error('Attempting transaction, though transactions are frozen');
    }
    global.runningTransactions++;
    try {
        let res = await asyncCallback();
        global.runningTransactions--;
        return res;
    } catch(e) {
        global.runningTransactions--;
        throw e;
    }
}