function request (url, body) {
  const method = body ? 'POST' : 'GET'
  return new Promise((resolve, reject) => {
    const xhr = new window.XMLHttpRequest()
    xhr.open(method, url)
    xhr.onload = () => resolve(xhr.responseText)
    xhr.onerror = () => reject(xhr.statusText)
    if (body) {
      xhr.setRequestHeader('Content-Type', 'application/json')
    }
    xhr.send(body ? JSON.stringify(body) : undefined)
  })
}

exports.request = request
