interface map {
  [key: string]:  string
}
interface map_of_maps {
  [key: string]: map
}

export const reject = (list: Array<map>, condition:map) => {
  return list.map(entry => {
    let keys = Object.keys(condition)
    for (let key of keys) {
      if (entry[key] !== condition[key]) {
        return entry
      }
    }
  }).filter(entry => entry !== undefined)
};

export function keyBy<T>(list: Array<T>, key: string): {[key: string]: T} {
  let mapped: {[key: string]: T} = {}
  list.forEach(entry => {
    mapped[(<map><unknown>entry)[key]] = entry
  })
  return mapped
};

export const each = (obj: map, callback: (val: string, key: string) => void) => {
  const keys = Object.keys(obj);
  keys.forEach(key => {
    callback(obj[key], key);
  });
};
