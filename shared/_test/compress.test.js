const {
  jcompress,
  jdecompress
} = require('../compress')
const testItem = require('../../server/fake-card-body.json').content

describe('char-encoding', () => {
  it('compresses large JSON into a smaller string', () => {
    const compressed = jcompress(testItem)
    const asString = JSON.stringify(testItem)
    expect(compressed.length < asString.length)
  })
  it('Decompression reverts back to normal', () => {
    const compressed = jcompress(testItem)
    expect(jdecompress(compressed)).toEqual(testItem)
  })
})
