function ok (response) {
  return response === 'OK'
}

function badInput (response) {
  return response === 'Bad Request'
}

function unathorized (response) {
  return response === 'Unathorized'
}

exports.ok = ok
exports.badInput = badInput
exports.unathorized = unathorized
