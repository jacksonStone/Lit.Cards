'use strict'

const authUtils = require('../utils')
const assert = require('assert')

describe('Encryption -> Decryptions', () => {
  it('Encryption then decryption should yeild same result', () => {
    const someText = 'Heythereyoureanallstar'
    const encryptedValue = authUtils.encrypt(someText)
    const decryptedValue = authUtils.decrypt(encryptedValue)
    assert.strictEqual(someText, decryptedValue)
  })
  it('Verify use of NONCE', () => {
    const someText = 'Heythereyoureanallstar'
    const encryptedValue = authUtils.encrypt(someText)
    const secondEncryptedValue = authUtils.encrypt(someText)
    const decryptedValue = authUtils.decrypt(encryptedValue)
    const decryptedSecondValue = authUtils.decrypt(secondEncryptedValue)
    assert.notStrictEqual(encryptedValue, secondEncryptedValue)
    assert.strictEqual(decryptedValue, decryptedSecondValue)
    assert.strictEqual(decryptedValue, someText)
  })
  it('Should return false if tampered with', () => {
    const someText = 'Heythereyoureanallstar'
    const encryptedValue = authUtils.encrypt(someText)
    const originalEncryptedParts = encryptedValue.split(':')
    const integrityCompromisedTextParts = authUtils.encrypt('fakeText').split(':')
    const firstTwo = integrityCompromisedTextParts.slice(0, 2).join(':')
    const tamperedVersion = [firstTwo, originalEncryptedParts[2]].join(':')
    assert.strictEqual(authUtils.decrypt(tamperedVersion), false)
  })
})
