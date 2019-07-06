const crypto = require('crypto')

function randomString(bytes, encoding = 'base64') {
  return new Promise((resolve) => {
    crypto.randomBytes(bytes, (err, buf) => {
      if (err) throw err;
      resolve(buf.toString('base64'))
    });
  })
}
module.exports.randomString = randomString
