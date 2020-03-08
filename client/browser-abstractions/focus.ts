import { $ } from './$'
function setFocusTo (selector: string) {
  let node = $(selector)
  node && node.focus()
}
export { setFocusTo }
