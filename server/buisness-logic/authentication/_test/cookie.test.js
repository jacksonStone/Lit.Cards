'use strict'

let cookieUtils = require('../cookie')
let authUtils = require('../utils')
let assert = require('assert')
let { signup: signupTest } = require('../signup')
let { resetTestEmails } = require('../../../node-abstractions/email')

let { resetData } = require('../../../database/external-connections/fake-database-connector')
let userId = 'Yours truely'
let authCookieName = 'auth'

describe('Cookie verification works', () => {
  beforeEach(async () => {
    await signupTest(userId, '123456')
  })
  afterEach(() => {
    resetTestEmails()
    resetData('user')
  })
  it('Happy path', async () => {
    let someText = JSON.stringify({ userId: userId, created: Date.now(), session: 0 })
    let encryptedValue = authUtils.encrypt(someText)
    let validatedCookie = await cookieUtils.validateUserCookie({ [authCookieName]: encryptedValue })
    assert.strictEqual(validatedCookie.userId, userId)
  })
  it('Invalid session on cookie', async () => {
    let someText = JSON.stringify({ userId: userId, created: Date.now(), session: 2 })
    let encryptedValue = authUtils.encrypt(someText)
    let validatedCookie = await cookieUtils.validateUserCookie({ [authCookieName]: encryptedValue })
    assert(!validatedCookie)
  })
  it('Expired', async () => {
    let someText = JSON.stringify({ userId: userId, created: Date.now() - 1000 * 60 * 60 * 24 * 60 })
    let encryptedValue = authUtils.encrypt(someText)
    let validatedCookie = await cookieUtils.validateUserCookie({ [authCookieName]: encryptedValue })
    assert.strictEqual(validatedCookie, undefined)
  })
  it('Verify cookie created', () => {
    let cookie = cookieUtils.createUserCookie(userId)
    assert.strictEqual(cookie.name, authCookieName)
    let encryptedValue = cookie.value
    let decryptedValue = authUtils.decrypt(encryptedValue)
    let value = JSON.parse(decryptedValue)
    assert.strictEqual(value.userId, userId)
    assert.ok(value.created)
  })
})
