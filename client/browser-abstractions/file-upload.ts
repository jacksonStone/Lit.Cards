function getFileFromFileUploadEvent (e: Event) {
  return (<HTMLInputElement>e.currentTarget).files[0]
}
// //https://stackoverflow.com/questions/7584794/accessing-jpeg-exif-rotation-data-in-javascript-on-the-client-side/32490603#32490603
/*eslint-disable */
function getOrientation (file: Blob, callback: (orient: number) => void) {
  var reader = new window.FileReader()
  reader.onload = function (e) {
    var view = new DataView(<ArrayBuffer>e.target.result)
    if (view.getUint16(0, false) !== 0xFFD8) {
      return callback(-2)
    }
    var length = view.byteLength; var offset = 2
    while (offset < length) {
      if (view.getUint16(offset + 2, false) <= 8) return callback(-1)
      var marker = view.getUint16(offset, false)
      offset += 2
      if (marker === 0xFFE1) {
        if (view.getUint32(offset += 2, false) !== 0x45786966) {
          return callback(-1)
        }

        var little = view.getUint16(offset += 6, false) === 0x4949
        offset += view.getUint32(offset + 4, little)
        var tags = view.getUint16(offset, little)
        offset += 2
        for (var i = 0; i < tags; i++) {
          if (view.getUint16(offset + (i * 12), little) === 0x0112) {
            return callback(view.getUint16(offset + (i * 12) + 8, little))
          }
        }
      } else if ((marker & 0xFF00) !== 0xFF00) {
        break
      } else {
        offset += view.getUint16(offset, false)
      }
    }
    return callback(-1)
  }
  reader.readAsArrayBuffer(file)
}
/* eslint-enable */
function getFileData (e: Event): Promise<Array<any>> {
  let file = getFileFromFileUploadEvent(e)
  return Promise.all([new Promise((resolve, reject) => {
    let reader = new window.FileReader()
    let timeoutId = window.setTimeout(() => {
      // TODO::Try to handle this in a way that gets surfaced to the user
      console.error('FAILED TO PROCESS FILE')
      reject(new Error('Failed to process file'))
    }, 5000)
    reader.onload = (e) => {
      window.clearTimeout(timeoutId)
      resolve(<string>e.target.result)
    }
    reader.readAsDataURL(file)
  }), new Promise(resolve => {
    // For weird iphone selfy stuff
    getOrientation(file, resolve)
  })
  ])
}
// https://stackoverflow.com/questions/7584794/accessing-jpeg-exif-rotation-data-in-javascript-on-the-client-side/32490603#32490603
async function getImageAtDifferentSize (imageDataAndOrientation: Array<string|number>): Promise<string> {
  let imageData = <string> imageDataAndOrientation[0];
  let orientation = <number> imageDataAndOrientation[0];
  let defaultSize = 600
  return new Promise((resolve) => {
    let img = document.createElement('img')
    let canvasElement = document.createElement('canvas')
    img.src = <string>imageData
    img.onload = () => {
      let ctx = canvasElement.getContext('2d')
      let results = []
      
        let [MAX_WIDTH, MAX_HEIGHT] = [defaultSize, defaultSize]
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

        // set proper canvas dimensions before transform & export
        if (orientation > 4 && orientation < 9) {
          canvasElement.width = height
          canvasElement.height = width
        } else {
          canvasElement.width = width
          canvasElement.height = height
        }

        // transform context before drawing image
        switch (orientation) {
          case 2: ctx.transform(-1, 0, 0, 1, width, 0); break
          case 3: ctx.transform(-1, 0, 0, -1, width, height); break
          case 4: ctx.transform(1, 0, 0, -1, 0, height); break
          case 5: ctx.transform(0, 1, 1, 0, 0, 0); break
          case 6: ctx.transform(0, 1, -1, 0, height, 0); break
          case 7: ctx.transform(0, -1, -1, 0, height, width); break
          case 8: ctx.transform(0, -1, 1, 0, 0, width); break
          default: break
        }

        // draw image
        ctx.drawImage(img, 0, 0, width, height)

        // rotateImageBasedOnOrientation(7, ctx, width, height);
        resolve(canvasElement.toDataURL('image/jpeg', 0.9))
      
    }
  })
}

function renderPreviewImageWithRawData (data: string, targetId = 'image-spot') {
  const imageHolder = window.document.getElementById(targetId)
  if (imageHolder) {
    imageHolder.setAttribute('style', `background-image:url(${data}); `)
  }
}
function addImageDataToImage (data: string, targetId: string) {
  let output = document.getElementById(targetId)
  output.setAttribute('src', data)
}

export {
  getFileData,
  renderPreviewImageWithRawData,
  addImageDataToImage,
  getImageAtDifferentSize
}
