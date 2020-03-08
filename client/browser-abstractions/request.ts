interface requestOptions {
  binary?:boolean
}

function request (url: string, body: Object|string, options:requestOptions = {}): Promise<string> {
  let method = body ? 'POST' : 'GET'
  let binary = options.binary
  return new Promise((resolve, reject) => {
    try {
      let xhr = new window.XMLHttpRequest()
      xhr.open(method, url)
      xhr.onload = () => resolve(xhr.responseText)
      xhr.onerror = () => {
        reject(xhr.statusText)
      }
      if (body) {
        if (!binary) {
          xhr.setRequestHeader('Content-Type', 'application/json')
          xhr.send(JSON.stringify(body))
        } else {
          xhr.setRequestHeader('Content-Type', 'application/octet-stream')
          xhr.send(<string>body)
        }
      } else {
        xhr.send()
      }
    } catch (e) {
      reject(e)
    }
  })
}

export { request }
