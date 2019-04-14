const express = require('express')
const router = express.Router()
const { getLoginCookie, verify } = require('../../buisnessLogic/authentication/login')
const code = require('../../nodeAbstractions/responseCodes')
const { addCookie } = require('../../nodeAbstractions/cookie')

router.post('/', async (req, res) => {
  if (!req.body) return code.unauthorized(res)
  const userId = req.body.userId
  const password = req.body.password
  if (!userId || !password) return code.unauthorized(res)
  const valid = await verify(userId, password)
  if (!valid) return code.unauthorized(res)
  const cookie = getLoginCookie(userId)
  addCookie(res, cookie)
  return code.ok(res)
})

module.exports = router
