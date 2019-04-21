function getFileFromFileUploadEvent (e) {
  return e.currentTarget.files[0]
}

function renderPreviewImageFromUploadEvent (e, targetId) {
  const file = getFileFromFileUploadEvent(e)
  const reader = new window.FileReader()

  reader.onload = (e) => {
    document.getElementById(targetId).setAttribute('src', e.target.result)
  }

  reader.readAsDataURL(file)
}

module.exports = {
  renderPreviewImageFromUploadEvent
}
