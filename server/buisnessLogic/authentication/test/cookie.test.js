'use strict'

const cookieUtils = require('../cookie')
const authUtils = require('../utils')
const assert = require('assert')
const userName = 'Yours truely'
const authCookieName = 'auth'

describe('Cookie verification works', () => {
  it('Happy path', () => {
    const someText = JSON.stringify({ username: userName, created: Date.now() })
    const encryptedValue = authUtils.encrypt(someText)
    const validatedCookie = cookieUtils.validateUserCookie({ [authCookieName]: encryptedValue })
    assert.strictEqual(validatedCookie, userName)
  })
  it('Expired', () => {
    const someText = JSON.stringify({ username: userName, created: Date.now() - 1000 * 60 * 60 * 24 * 60 })
    const encryptedValue = authUtils.encrypt(someText)

    const validatedCookie = cookieUtils.validateUserCookie({ [authCookieName]: encryptedValue })
    assert.strictEqual(validatedCookie, undefined)
  })
  it('Verify cookie created', () => {
    const cookie = cookieUtils.createUserCookie(userName)
    assert.strictEqual(cookie.name, authCookieName)
    const encryptedValue = cookie.value
    const decryptedValue = authUtils.decrypt(encryptedValue)
    const value = JSON.parse(decryptedValue)
    assert.strictEqual(value.username, userName)
    assert.ok(value.created)
  })
})
