const express = require('express')
const router = express.Router()
const { getLoginCookie } = require('../../buisnessLogic/authentication/login')
const code = require('../../nodeAbstractions/responseCodes')
const { addCookie } = require('../../nodeAbstractions/cookie')

router.post('/', async (req, res) => {
  if (!req.body) return code.unathorized(res)
  const userId = req.body.userId
  const password = req.body.password
  if (!userId || !password) return code.unathorized(res)
  const cookie = getLoginCookie(userId)
  addCookie(res, cookie)
  return code.ok(res)
})

module.exports = router
