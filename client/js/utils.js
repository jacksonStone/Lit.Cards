module.exports.reject = (list, condition) => {
  return list.map(entry => {
    const keys = Object.keys(condition)
    for (let key of keys) {
      if (entry[key] !== condition[key]) {
        return entry
      }
    }
  }).filter(entry => entry !== undefined)
}
