let express = require('express')
let router = express.Router()
let code = require('../../node-abstractions/response-codes')
let { getAllData } = require('../../database/external-connections/fake-database-connector')
router.get('/debug', async (req, res) => {
  if(process.env.NODE_ENV !== 'development') return code.unauthorized(res)
  return res.json(await getAllData())
})

module.exports = router
