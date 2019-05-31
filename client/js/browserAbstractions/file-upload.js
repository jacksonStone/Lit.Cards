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

async function getImageAtDifferentSize (imageData, ...sizes) {
  sizes = !sizes.length ? [[600, 600]] : sizes
  return new Promise((resolve) => {
    const img = document.createElement('img')
    const canvasElement = document.createElement('canvas')
    img.src = imageData
    img.onload = () => {
      const ctx = canvasElement.getContext('2d')
      const results = []
      for (let i = 0; i < sizes.length; i++) {
        let [MAX_WIDTH, MAX_HEIGHT] = sizes[i]
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
        canvasElement.width = width
        canvasElement.height = height
        ctx.drawImage(img, 0, 0, width, height)
        results.push(canvasElement.toDataURL('image/jpeg', 0.9))
      }
      resolve(results)
    }
  })
}

function renderPreviewImageWithRawData (data, targetId = 'image-spot') {
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
