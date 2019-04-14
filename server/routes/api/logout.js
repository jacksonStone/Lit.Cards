const express = require('express')
const router = express.Router()
const { getLogoutCookie } = require('../../buisnessLogic/authentication/login')
const { addCookie } = require('../../nodeAbstractions/cookie')
const code = require('../../nodeAbstractions/responseCodes')

router.get('/', (_, res) => {
  addCookie(res, getLogoutCookie())
  code.ok(res)
})

module.exports = router
