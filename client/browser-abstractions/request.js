function request (url, body) {
  let method = body ? 'POST' : 'GET'
  return new Promise((resolve, reject) => {
    try {
      let xhr = new window.XMLHttpRequest()
      xhr.open(method, url)
      xhr.onload = () => resolve(xhr.responseText)
      xhr.onerror = () => {console.log("HAD VALID REJECT"); reject(xhr.statusText);}
      if (body) {
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify(body))
      } else {
        xhr.send();
      }
    } catch(e) {
      console.log("ERROR DURRING THE ACTUAL REQUEST");
      console.log(e);
      reject(e);
    }

  })
}

exports.request = request
