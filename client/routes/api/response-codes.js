function ok (response) {
  return response === 'OK'
}

function badInput (response) {
  return response === 'Bad Request'
}

function unauthorized (response) {
  return response === 'unauthorized'
}

export default { ok, badInput, unauthorized };
