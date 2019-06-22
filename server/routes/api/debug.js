const express = require('express')
const router = express.Router()
const code = require('../../node-abstractions/response-codes')
const { getAllData } = require('../../database/external-connections/fake-database-connector')
router.get('/debug', async (req, res) => {
  console.log(process.env.NODE_ENV)
  if(process.env.NODE_ENV !== 'development') return code.unauthorized(res)
  return res.json(await getAllData())
})

module.exports = router
