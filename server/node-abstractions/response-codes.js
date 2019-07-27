
function unauthorized (res, msg) {
  if (msg) {
    return res.status(401).send(msg)
  }
  res.sendStatus(401)
}

function invalidRequest (res, msg) {
  if (msg) {
    return res.status(400).send(msg)
  }
  res.sendStatus(400)
}

function ok (res, msg) {
  if (msg) {
    return res.status(200).send(msg)
  }
  res.sendStatus(200)
}

module.exports = {
  unauthorized,
  invalidRequest,
  ok
}
