import { $ } from './$';
function setFocusTo (selector) {
  let node = $(selector)
  node && node.focus()
}
export { setFocusTo };
