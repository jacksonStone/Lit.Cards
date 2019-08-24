module.exports.reject = (list, condition) => {
  return list.map(entry => {
    let keys = Object.keys(condition)
    for (let key of keys) {
      if (entry[key] !== condition[key]) {
        return entry
      }
    }
  }).filter(entry => entry !== undefined)
}
module.exports.keyBy = (list, key) => {
  let mapped = {}
  list.forEach(entry => {
    mapped[entry[key]] = entry
  })
  return mapped
}
