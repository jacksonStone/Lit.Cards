let express = require('express')
let router = express.Router()
let code = require('../../node-abstractions/response-codes')

router.get('/', async (req, res) => {
    if (!req.headers['preventtransactionkey']) return code.unauthorized(res)
    else if (req.headers['preventtransactionkey'] === process.env.DEPLOYMENT_KEY) {
        if (global.runningTransactions) {
            return code.invalidRequest(res)
        }
        global.preventTransactions = true
        console.log("Preventing transactions");
        return code.ok(res)
    }
})

module.exports = router;