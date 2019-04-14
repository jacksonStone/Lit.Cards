const express = require('express')
const path = require('path')
const app = express()
const port = 3000

const ROOT = path.join(__dirname, '../')
app.use(express.static(path.join(ROOT, '/client/dist')))
app.get('/', function (req, res) {
  res.sendFile(path.join(ROOT, '/client/html/index.html'))
})
app.use('/uswds', express.static(path.join(ROOT, 'node_modules/uswds')))
app.use('/fonts', express.static(path.join(ROOT, 'client/fonts')))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
