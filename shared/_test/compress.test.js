let {
  jcompress,
  jdecompress
} = require('../compress')
let testItem = require('../../server/fake-card-body.json')

describe('char-encoding', () => {
  it('compresses large JSON into a smaller string', () => {
    let compressed = jcompress(testItem)
    let asString = JSON.stringify(testItem)
    expect(compressed.length < asString.length)
  })
  it('Decompression reverts back to normal', () => {
    let compressed = jcompress(testItem)
    expect(jdecompress(compressed)).toEqual(testItem)
  })
})
