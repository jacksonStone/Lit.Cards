// Probably just temporary until we have a real DB
export const generateId = (length = 16) => {
  let charArray = []
  let possibleValues = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
    'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
  for (let i = 0; i < length; i++) {
    charArray.push(possibleValues[((Math.random() * possibleValues.length) | 0)])
  }
  return charArray.join('')
};
