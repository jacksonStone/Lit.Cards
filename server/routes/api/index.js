let express = require('express')
let router = express.Router()
let {requireActiveSub} = require('./middleware');

router.use('/', require('./debug'))
router.use('/login', require('./login'))
router.use('/transaction', requireActiveSub);
router.use('/transaction', require('./transaction'))
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
router.use('/prevent-transactions', require('./prevent-transactions'))

module.exports = router
