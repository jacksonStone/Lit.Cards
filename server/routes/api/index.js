let express = require('express')
let router = express.Router()
let {requireActiveSub} = require('./middleware');
let bodyParser = require('body-parser');

let parseBody = bodyParser.json({limit:'1mb', extended: true})
router.use(parseBody);
router.use('/', require('./debug'))
router.use('/login', parseBody)
router.use('/login', require('./login'))
// We need to load in this route at a different time
// router.use('/transaction', requireActiveSub);
// router.use('/transaction', require('./transaction'))
router.use('/logout', require('./logout'))
router.use('/user', require('./user'))
router.use('/signup', require('./signup'))
router.use('/decks', require('./decks'))
router.use('/study', require('./study'))
router.use('/study-history', require('./study-history'))
router.use('/card-body', requireActiveSub);
router.use('/card-body', require('./card-bodies'))
router.use('/password-reset', require('./password-reset'))
router.use('/stripe', require('./stripe').router)

module.exports = router
