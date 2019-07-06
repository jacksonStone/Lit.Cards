'use strict'

const cookieUtils = require('../cookie')
const authUtils = require('../utils')
const assert = require('assert')
const { signup: signupTest } = require('../signup')
const { resetData } = require('../../../database/external-connections/fake-database-connector')
const userId = 'Yours truely'
const authCookieName = 'auth'

describe('Cookie verification works', () => {
  beforeEach(async () => {
    await signupTest(userId, '123456')
  })
  afterEach(() => resetData('user'))
  it('Happy path', async () => {
    const someText = JSON.stringify({ userId: userId, created: Date.now(), session: 0 })
    const encryptedValue = authUtils.encrypt(someText)
    const validatedCookie = await cookieUtils.validateUserCookie({ [authCookieName]: encryptedValue })
    assert.strictEqual(validatedCookie.userId, userId)
  })
  it('Invalid session on cookie', async () => {
    const someText = JSON.stringify({ userId: userId, created: Date.now(), session: 2 })
    const encryptedValue = authUtils.encrypt(someText)
    const validatedCookie = await cookieUtils.validateUserCookie({ [authCookieName]: encryptedValue })
    assert(!validatedCookie)
  })
  it('Expired', async () => {
    const someText = JSON.stringify({ userId: userId, created: Date.now() - 1000 * 60 * 60 * 24 * 60 })
    const encryptedValue = authUtils.encrypt(someText)
    const validatedCookie = await cookieUtils.validateUserCookie({ [authCookieName]: encryptedValue })
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
