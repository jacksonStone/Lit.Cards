exports.html = (strings, ...values) => {
  const finalString = []
  for (let i = 0; i < strings.length; i++) {
    finalString.push(strings[i])
    if (i !== strings.length - 1) finalString.push(values[i])
  }
  return finalString.join('')
}
exports.render = () => {}
