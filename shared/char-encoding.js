function listToStr (list) {
  // TODO:: Maybe look into how spread op is implemented
  return String.fromCharCode(...list)
}
function strToList (str) {
  const list = []
  for (let i = 0; i < str.length; i++) {
    list.push(str.charCodeAt(i))
  }
  return list
}

module.exports = {
  listToStr,
  strToList
}
