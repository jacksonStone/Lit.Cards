let code = require('../../node-abstractions/response-codes')
function requireActiveSub(req, res, next){
    if(!req.userSubbed){
        return code.unauthorized(res);
    }
    next()
}

module.exports = {requireActiveSub};