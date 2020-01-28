let { handleTransaction } = require('../routes/api/transaction')

function str2ab(str) {
  var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i=0, strLen=str.length; i<strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}
module.exports.handleTransaction = (transaction)=> {
    //We try this because safari cannot send utf-16 strings, but reformats them to utf-8s
    let arrayBufferTransaction = str2ab(JSON.stringify(transaction));
    return handleTransaction(arrayBufferTransaction);
}
