function getFileFromFileUploadEvent (e) {
  return e.currentTarget.files[0]
}

function renderPreviewImageFromUploadEvent (e, targetId) {
  const file = getFileFromFileUploadEvent(e)
  const reader = new window.FileReader()

  reader.onload = (e) => {
    window.document
      .getElementById(targetId)
      .setAttribute('style', `background-image:url(${e.target.result}); `)
  }

  reader.readAsDataURL(file)
}
function copyImageFromBackgroundtoImage (sourceId, targetId) {
  const style = window.document
    .getElementById(sourceId)
    .getAttribute('style')
  const dataURI = style.split('background-image:url(')[1].split(');')[0]
  const output = document.getElementById(targetId)
  output.setAttribute('src', dataURI)
}

module.exports = {
  renderPreviewImageFromUploadEvent,
  copyImageFromBackgroundtoImage
}
