export const reject = (list, condition) => {
  return list.map(entry => {
    let keys = Object.keys(condition)
    for (let key of keys) {
      if (entry[key] !== condition[key]) {
        return entry
      }
    }
  }).filter(entry => entry !== undefined)
};

export const keyBy = (list, key) => {
  let mapped = {}
  list.forEach(entry => {
    mapped[entry[key]] = entry
  })
  return mapped
};

export const each = (obj, callback) => {
  const keys = Object.keys(obj);
  keys.forEach(key => {
    callback(obj[key], key);
  });
};
