const { $ } = require('./$')
exports.grabFormData = function (selector) {
  const formNode = $(selector)
  if (!formNode) {
    throw new Error('Bad form selector give')
  }
  const formData = new window.FormData($(selector))
  const entries = formData.entries()
  const data = {}
  for (let pair of entries) {
    data[pair[0]] = pair[1]
  }
  return data
}
