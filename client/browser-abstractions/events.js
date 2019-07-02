function getValueFromInput (e) {
  return e.target.value
}
function getValueFromCheckbox (e) {
  return e.target.checked
}

module.exports = {
  getValueFromInput,
  getValueFromCheckbox
}
