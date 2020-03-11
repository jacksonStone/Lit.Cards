function ok (response: string) {
  return response === 'OK'
}

function badInput (response: string) {
  return response === 'Bad Request'
}

function unauthorized (response: string) {
  return response === 'unauthorized'
}

export default { ok, badInput, unauthorized };
