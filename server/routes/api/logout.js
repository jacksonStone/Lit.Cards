const express = require('express')
const router = express.Router()
const { getLogoutCookie } = require('../../buisness-logic/authentication/login')
const { addCookie } = require('../../node-abstractions/cookie')
const code = require('../../node-abstractions/response-codes')

router.get('/', (_, res) => {
  addCookie(res, getLogoutCookie())
  code.ok(res)
})

module.exports = router
