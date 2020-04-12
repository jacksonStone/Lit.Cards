import { handleTransaction as handleTransactionAPI } from '../routes/api/transaction'
declare const electron: any;

import 'types';
function str2ab (str: string) :ArrayBuffer {
  var buf = new ArrayBuffer(str.length * 2) // 2 bytes for each char
  var bufView = new Uint16Array(buf)
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i)
  }
  return buf
}

export const handleTransaction = (transaction: Transaction): Promise<string> => {
  if(electron) {
    //If we are in electron - we do not need to do this weird blob thing - just send the string.
    return handleTransactionAPI(transaction)
  }
  // We try this because safari cannot send utf-16 strings, but reformats them to utf-8s
  let arrayBufferTransaction = str2ab(JSON.stringify(transaction))
  return handleTransactionAPI(arrayBufferTransaction)
}
