const uuidV4 = require('uuid/v4')
const crypto = require('crypto')
const HASHING_FUNCTION_NAME = 'sha256'
const ENCRYPTION_FUNCTION_NAME = 'aes-128-cbc'
const ENCRYPTION_PASSWORD = process.env.SIMPLE_NOTE_ENCRYPTION.slice(0, 16)
const HMAC_KEY = process.env.SIMPLE_NOTE_HMAC_KEY.slice(0, 16)

if (!ENCRYPTION_PASSWORD) throw new Error('Must have SIMPLE_NOTE_ENCRYPTION env value')
if (!HMAC_KEY) throw new Error('Must have SIMPLE_NOTE_HMAC_KEY env value')

function getSalt () {
  return uuidV4()
}

function getHMAC (encryptedText, nonce) {
  return hashValues(encryptedText + nonce, HMAC_KEY)
}

function hashValues (val1, val2) {
  const hashFunction = crypto.createHash(HASHING_FUNCTION_NAME)
  return hashFunction.update(val1 + val2).digest('base64')
}

function getNonce () {
  const iv = Buffer.from(crypto.randomBytes(16))
  return iv.toString('hex').slice(0, 16)
}

function encrypt (text) {
  const nonce = getNonce()
  const cipher = crypto.createCipheriv(ENCRYPTION_FUNCTION_NAME, ENCRYPTION_PASSWORD, nonce)
  cipher.setEncoding('hex')
  cipher.write(text)
  cipher.end()
  const crypted = cipher.read()
  const hmac = getHMAC(crypted, nonce)
  return [nonce, crypted, hmac].join(':')
}

function decrypt (text) {
  if (!verifyBodyWithHMAC(text)) {
    return false
  }
  try {
    const parts = text.split(':')
    const nonce = parts[0]
    const encryptedText = parts[1]
    const decipher = crypto.createDecipheriv(ENCRYPTION_FUNCTION_NAME, ENCRYPTION_PASSWORD, nonce)
    let dec = decipher.update(encryptedText, 'hex', 'utf8')
    dec += decipher.final('utf8')
    return dec
  } catch (e) {
    return false
  }
}

function verifyBodyWithHMAC (encryptionBody) {
  const parts = encryptionBody.split(':')
  if (parts.length < 3) return false
  const nonce = parts[0]
  const encryptedText = parts[1]
  const hmac = parts[2]
  const newHMAC = getHMAC(encryptedText, nonce)
  return hmac === newHMAC
}

module.exports = {
  getSalt,
  encrypt,
  decrypt,
  hashValues
}
