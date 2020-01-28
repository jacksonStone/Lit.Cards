let express = require('express')
let router = express.Router()
let{
  handleTransaction
} = require('../../buisness-logic/transaction')
let code = require('../../node-abstractions/response-codes')

router.post('/', async (req, res) => {
    if (!req.userEmail) return code.unauthorized(res)
    if (!req.body) return code.invalidRequest(res)
    try {
      const asStr = Buffer.from(req.body).toString('utf16le');
      const asJSON = JSON.parse(asStr);
      await handleTransaction(req.userEmail, asJSON);
      return code.ok(res);
    } catch(e) {
      console.error(e); //TODO:: Do something better here
      return code.invalidRequest(res);
    }
})

module.exports = router