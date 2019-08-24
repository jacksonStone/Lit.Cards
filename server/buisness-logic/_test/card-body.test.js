let { sanitizeCardContent } = require('../card-body')
test.only('Sanitizes card data', () => {
  let unsafeHTML = `
  <p>foo</p>
  <script>alert('gotcha!')</script>
  `
  let changes = {
    front: unsafeHTML,
    back: unsafeHTML
  }
  sanitizeCardContent(changes)
  changes.front = changes.front.trim()
  changes.back = changes.back.trim()
  expect(changes).toEqual({
    front: '<p>foo</p>',
    back: '<p>foo</p>'
  })
})
