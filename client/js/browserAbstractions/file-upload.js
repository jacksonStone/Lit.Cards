function getFileFromFileUploadEvent (e) {
  return e.currentTarget.files[0]
}

function getFileData (e) {
  return new Promise((resolve, reject) => {
    const file = getFileFromFileUploadEvent(e)
    const reader = new window.FileReader()
    const timeoutId = window.setTimeout(() => {
      // TODO::Try to handle this in a way that gets surfaced to the user
      console.error('FAILED TO PROCESS FILE')
      reject(new Error('Failed to process file'))
    }, 5000)
    reader.onload = (e) => {
      window.clearTimeout(timeoutId)
      resolve(e.target.result)
    }
    reader.readAsDataURL(file)
  })
}

function renderPreviewImageWithRawData (data, targetId) {
  window.document
    .getElementById(targetId)
    .setAttribute('style', `background-image:url(${data}); `)
}
function copyImageFromBackgroundtoImage (sourceId, targetId) {
  // TODO:: CLean up this crap
  const style = window.document
    .getElementById(sourceId)
    .getAttribute('style')
  const dataURI = style.split('background-image:url(')[1].split(');')[0]
  const output = document.getElementById(targetId)
  output.setAttribute('src', dataURI)
}

module.exports = {
  getFileData,
  renderPreviewImageWithRawData,
  copyImageFromBackgroundtoImage
}
