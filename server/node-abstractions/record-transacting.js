module.exports = async function (asyncCallback) {
  if (global.preventTransactions) {
    console.error('Attempting transaction, though transactions are being prevented')
    throw Error('Attempting transaction, though transactions are being prevented')
  }
  global.runningTransactions++
  try {
    let res = await asyncCallback()
    setTimeout(() => {
      global.runningTransactions--
    }, 10000)
    return res
  } catch (e) {
    global.runningTransactions--
    throw e
  }
}
