var express = require('express')
var router = express.Router()
const _ = require('lodash');
const { sendPage } = require('./send-page');

const makePageRoute = (path, page, auth) => {
  router.get(path, async (req, res) => {
    if(auth) {
      if (!req.userId) return res.redirect('/')
    }
    return sendPage(res, page)
  })
}

const pages = {
  '/': {
    page: 'index',
    auth: false
  },
  '/forgot-password': {
    page: 'forgot-password',
    auth: false
  },
  '/verify': {
    page: 'verify-password-reset',
    auth: false
  },
  '/login': {
    page: 'login',
    auth: false
  },
  '/signup': {
    page: 'signup',
    auth: false
  },
  // url to visit: /site/me for example
  '/me': {
    page: 'me/me', // path to html file in assets
    // auth: true - default
  },
  '/me/deck': {
    page: 'me/deck',
  },
  '/me/study': {
    page: 'me/study',
    // Auth: true - default
  },
}

_.each(pages, (details, path) => {
  const auth = details.auth === undefined ? true : details.auth
  makePageRoute(path, details.page, auth)
})

module.exports = router
