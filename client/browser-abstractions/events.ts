function getValueFromInput (e: Event): any {
  return (<HTMLInputElement>e.target).value
}
function getValueFromCheckbox (e: Event) {
  return (<HTMLInputElement>e.target).checked
}

export {
  getValueFromInput,
  getValueFromCheckbox
}
