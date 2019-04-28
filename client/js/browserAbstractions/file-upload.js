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

async function getImageAtDifferentSize (imageData, MAX_HEIGHT = 600, MAX_WIDTH = 600) {
  return new Promise((resolve) => {
    const img = document.createElement('img')
    const canvasElement = document.createElement('canvas')
    img.src = imageData
    img.onload = () => {
      const ctx = canvasElement.getContext('2d')

      let width = img.width
      let height = img.height

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width
          width = MAX_WIDTH
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height
          height = MAX_HEIGHT
        }
      }
      console.log('Trying to create with width: ' + width)
      console.log('Trying to create with height: ' + height)

      canvasElement.width = width
      canvasElement.height = height
      ctx.drawImage(img, 0, 0, width, height)
      resolve(canvasElement.toDataURL())
    }
  })
}

function renderPreviewImageWithRawData (data, targetId) {
  window.document
    .getElementById(targetId)
    .setAttribute('style', `background-image:url(${data}); `)
}
function addImageDataToImage (data, targetId) {
  const output = document.getElementById(targetId)
  output.setAttribute('src', data)
}

module.exports = {
  getFileData,
  renderPreviewImageWithRawData,
  addImageDataToImage,
  getImageAtDifferentSize
}
