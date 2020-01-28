function request (url, body, options = {}) {
  let method = body ? 'POST' : 'GET'
  let binary = options.binary;
  return new Promise((resolve, reject) => {
    try {
      let xhr = new window.XMLHttpRequest()
      xhr.open(method, url)
      xhr.onload = () => resolve(xhr.responseText)
      xhr.onerror = () => {
        reject(xhr.statusText);
      }
      if (body) {
        if(!binary) {
          xhr.setRequestHeader('Content-Type', 'application/json')
          xhr.send(JSON.stringify(body))
        }
        else {
          xhr.setRequestHeader('Content-Type', 'application/octet-stream')
          xhr.send(body);
        }
      } else {
        xhr.send();
      }
    } catch(e) {
      reject(e);
    }

  })
}

exports.request = request
