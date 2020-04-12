function handlePostRequest(path, body) {
  console.log(`Post: ${path}, ${JSON.stringify(body)}`);

  return JSON.stringify([]);
}

module.exports = handlePostRequest;
