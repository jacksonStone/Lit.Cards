
function addCookie (res, cookie) {
  return res.cookie(cookie.name, cookie.value, cookie.options)
}

module.exports = {
  addCookie
}
