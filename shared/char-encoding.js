function listToStr (list) {
  if (list.length > 150000) {
    // :) Just in case, you know?
    return _listToStr2(list)
  }
  return String.fromCharCode(...list)
}
function intToChar(int) {
  return String.fromCharCode(int)
}
function charToInt(char) {
  return char.charCodeAt(0)
}
// About 1/6th the speed as the above, but
// can handle any size list AFAIK
function _listToStr2 (list) {
  let str = ''
  for (let i = 0; i < list.length; i++) {
    str += String.fromCharCode(list[i])
  }
  return str
}
function strToList (str) {
  let list = []
  for (let i = 0; i < str.length; i++) {
    list.push(str.charCodeAt(i))
  }
  return list
}

module.exports = {
  listToStr,
  strToList,
  charToInt,
  intToChar
}
