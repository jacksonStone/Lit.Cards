let uuidV4 = require('uuid/v4')
let crypto = require('crypto')
let HASHING_FUNCTION_NAME = 'sha256'
let ENCRYPTION_FUNCTION_NAME = 'aes-128-cbc'
let ENCRYPTION_PASSWORD = process.env.SIMPLE_NOTE_ENCRYPTION.slice(0, 16)
let HMAC_KEY = process.env.SIMPLE_NOTE_HMAC_KEY.slice(0, 16)

if (!ENCRYPTION_PASSWORD) throw new Error('Must have SIMPLE_NOTE_ENCRYPTION env value')
if (!HMAC_KEY) throw new Error('Must have SIMPLE_NOTE_HMAC_KEY env value')

function getSalt () {
  return uuidV4()
}

function getHMAC (encryptedText, nonce) {
  return hashValues(encryptedText + nonce, HMAC_KEY)
}

function hashValues (val1, val2) {
  let hashFunction = crypto.createHash(HASHING_FUNCTION_NAME)
  return hashFunction.update(val1 + val2).digest('base64')
}

function getNonce () {
  let iv = Buffer.from(crypto.randomBytes(16))
  return iv.toString('hex').slice(0, 16)
}

function encrypt (text) {
  let nonce = getNonce()
  let cipher = crypto.createCipheriv(ENCRYPTION_FUNCTION_NAME, ENCRYPTION_PASSWORD, nonce)
  cipher.setEncoding('hex')
  cipher.write(text)
  cipher.end()
  let crypted = cipher.read()
  let hmac = getHMAC(crypted, nonce)
  return [nonce, crypted, hmac].join(':')
}

function decrypt (text) {
  if (!verifyBodyWithHMAC(text)) {
    return false
  }
  try {
    let parts = text.split(':')
    let nonce = parts[0]
    let encryptedText = parts[1]
    let decipher = crypto.createDecipheriv(ENCRYPTION_FUNCTION_NAME, ENCRYPTION_PASSWORD, nonce)
    let dec = decipher.update(encryptedText, 'hex', 'utf8')
    dec += decipher.final('utf8')
    return dec
  } catch (e) {
    return false
  }
}

function verifyBodyWithHMAC (encryptionBody) {
  let parts = encryptionBody.split(':')
  if (parts.length < 3) return false
  let nonce = parts[0]
  let encryptedText = parts[1]
  let hmac = parts[2]
  let newHMAC = getHMAC(encryptedText, nonce)
  return hmac === newHMAC
}

module.exports = {
  getSalt,
  encrypt,
  decrypt,
  hashValues
}
