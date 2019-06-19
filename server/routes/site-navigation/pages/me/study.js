const express = require('express')
const router = express.Router()
const { sendPage } = require('../../send-page')

router.get('/', (_, res) => {
  sendPage(res, 'me/study')
})

module.exports = router
