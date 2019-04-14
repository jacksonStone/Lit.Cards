'use strict'

const cookieUtils = require('../cookie')
const authUtils = require('../utils')
const assert = require('assert')
const userId = 'Yours truely'
const authCookieName = 'auth'

describe('Cookie verification works', () => {
  it('Happy path', () => {
    const someText = JSON.stringify({ userId: userId, created: Date.now() })
    const encryptedValue = authUtils.encrypt(someText)
    const validatedCookie = cookieUtils.validateUserCookie({ [authCookieName]: encryptedValue })
    assert.strictEqual(validatedCookie, userId)
  })
  it('Expired', () => {
    const someText = JSON.stringify({ userId: userId, created: Date.now() - 1000 * 60 * 60 * 24 * 60 })
    const encryptedValue = authUtils.encrypt(someText)

    const validatedCookie = cookieUtils.validateUserCookie({ [authCookieName]: encryptedValue })
    assert.strictEqual(validatedCookie, undefined)
  })
  it('Verify cookie created', () => {
    const cookie = cookieUtils.createUserCookie(userId)
    assert.strictEqual(cookie.name, authCookieName)
    const encryptedValue = cookie.value
    const decryptedValue = authUtils.decrypt(encryptedValue)
    const value = JSON.parse(decryptedValue)
    assert.strictEqual(value.userId, userId)
    assert.ok(value.created)
  })
})
