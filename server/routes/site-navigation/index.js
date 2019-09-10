var express = require('express')
var router = express.Router()
let _ = require('lodash');
let { sendPage } = require('./send-page');

let makePageRoute = (path, details, auth) => {
  router.get(path, async (req, res) => {
    if(auth) {
      if (!req.userId) return res.redirect('/')
    }
    return sendPage(res, details, req.user)
  })
}

let pages = {
  '/': {
    darkModeable: false,
    title: 'Lit.Cards',
    entryFile: 'index.js',
    auth: false
  },
  '/forgot-password': {
    title: 'Lit: Forgotten password',
    darkModeable: false,
    page: 'forgot-password',
    entryFile: 'forgot-password.js',
    auth: false
  },
  '/verify': {
    darkModeable: false,
    title: 'Lit: New password',
    page: 'verify-password-reset',
    entryFile: 'verify-password-reset.js',
    auth: false
  },
  '/login': {
    title: 'Lit: Login',
    darkModeable: false,
    entryFile: 'login.js',
    page: 'login',
    auth: false
  },
  '/signup': {
    title: 'Lit: Sign Up',
    darkModeable: false,
    page: 'signup',
    entryFile: 'signup.js',
    auth: false
  },
  // url to visit: /site/me for example
  '/me': {
    title: 'Lit: Your stuff',
    darkModeable: true,
    entryFile: 'me.js',
    // auth: true - default
  },
  '/me/deck': {
    title: 'Lit: Edit deck',
    darkModeable: true,
    entryFile: 'deck.js',
    page: 'me/deck',
  },
  '/me/settings': {
    title: 'Lit: Settings',
    entryFile: 'settings.js',
    darkModeable: true,
  },
  '/me/study': {
    title: 'Lit: Study',
    entryFile: 'study.js',
    darkModeable: true,
  },
}

_.each(pages, (details, path) => {
  // Auth: true - default
  let auth = details.auth === undefined ? true : details.auth
  makePageRoute(path, details, auth)
})

function returnIndexPage (req, res) {
  return sendPage(res, pages['/'], req.user)
}

module.exports = {
  router,
  returnIndexPage
}
