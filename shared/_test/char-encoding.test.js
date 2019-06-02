const {
  listToStr,
  strToList
} = require('../char-encoding')

describe('char-encoding', () => {
  it('coverts lists to strings, and works with larger numbers', () => {
    const result = listToStr([48, 47, 220000, 45])
    expect(result.length).toEqual(4)
    expect(result).toEqual('0/孠-')
  })
  it('Coverts strings to lists', () => {
    const result = strToList('foobar')
    expect(result.length).toEqual(6)
    expect(result).toEqual([102, 111, 111, 98, 97, 114])
  })
  it('Converting back and forth works', () => {
    const list = [1, 22, 30220, 58]
    const listAsStr = listToStr(list)
    expect(strToList(listAsStr)).toEqual(list)
  })
})
