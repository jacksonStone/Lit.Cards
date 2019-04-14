
function unauthorized (res) {
  res.sendStatus(401)
}
function invalidRequest (res) {
  res.sendStatus(400)
}
function ok (res) {
  res.sendStatus(200)
}

module.exports = {
  unauthorized,
  invalidRequest,
  ok
}
