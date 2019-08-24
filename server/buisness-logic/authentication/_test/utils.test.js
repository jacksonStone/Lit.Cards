'use strict'

let authUtils = require('../utils')
let assert = require('assert')

describe('Encryption -> Decryptions', () => {
  it('Encryption then decryption should yeild same result', () => {
    let someText = 'Heythereyoureanallstar'
    let encryptedValue = authUtils.encrypt(someText)
    let decryptedValue = authUtils.decrypt(encryptedValue)
    assert.strictEqual(someText, decryptedValue)
  })
  it('Verify use of NONCE', () => {
    let someText = 'Heythereyoureanallstar'
    let encryptedValue = authUtils.encrypt(someText)
    let secondEncryptedValue = authUtils.encrypt(someText)
    let decryptedValue = authUtils.decrypt(encryptedValue)
    let decryptedSecondValue = authUtils.decrypt(secondEncryptedValue)
    assert.notStrictEqual(encryptedValue, secondEncryptedValue)
    assert.strictEqual(decryptedValue, decryptedSecondValue)
    assert.strictEqual(decryptedValue, someText)
  })
  it('Should return false if tampered with', () => {
    let someText = 'Heythereyoureanallstar'
    let encryptedValue = authUtils.encrypt(someText)
    let originalEncryptedParts = encryptedValue.split(':')
    let integrityCompromisedTextParts = authUtils.encrypt('fakeText').split(':')
    let firstTwo = integrityCompromisedTextParts.slice(0, 2).join(':')
    let tamperedVersion = [firstTwo, originalEncryptedParts[2]].join(':')
    assert.strictEqual(authUtils.decrypt(tamperedVersion), false)
  })
})
