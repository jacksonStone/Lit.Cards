let express = require('express')
let router = express.Router()
let { getLogoutCookie } = require('../../buisness-logic/authentication/login')
let { addCookie } = require('../../node-abstractions/cookie')
let code = require('../../node-abstractions/response-codes')

router.get('/', (_, res) => {
  addCookie(res, getLogoutCookie())
  code.ok(res)
})

module.exports = router
