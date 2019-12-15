let express = require('express')
let router = express.Router()
let{
  handleTransaction
} = require('../../buisness-logic/transaction')
let code = require('../../node-abstractions/response-codes')

router.post('/', async (req, res) => {
    if (!req.userEmail) return code.unauthorized(res)
    if (!req.body || !Object.keys(req.body).length) return code.invalidRequest(res)
    try {
      await handleTransaction(req.userEmail, req.body);
      return code.ok(res);
    } catch(e) {
      console.error(e); //TODO:: Do something better here
      return code.invalidRequest(res);
    }
})

module.exports = router