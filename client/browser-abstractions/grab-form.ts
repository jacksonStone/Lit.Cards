import { $ } from './$'

export const grabFormData = function (selector: string): {[key: string]: FormDataEntryValue}  {
  let formNode = $(selector)
  if (!formNode) {
    throw new Error('Bad form selector give')
  }
  let formData = new window.FormData($(selector))
  let entries = formData.entries()
  let data: {[key: string]: FormDataEntryValue} = {}
  for (let pair of entries) {
    data[pair[0]] = pair[1]
  }
  return data
}
