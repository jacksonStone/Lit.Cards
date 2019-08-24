let { $ } = require('./$')
exports.grabFormData = function (selector) {
  let formNode = $(selector)
  if (!formNode) {
    throw new Error('Bad form selector give')
  }
  let formData = new window.FormData($(selector))
  let entries = formData.entries()
  let data = {}
  for (let pair of entries) {
    data[pair[0]] = pair[1]
  }
  return data
}
