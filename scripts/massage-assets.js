const zlib = require('zlib');
const fs = require('fs');
const path = require('path');
const distPath = path.resolve(__dirname, '../assets/dist');
const cssDist = path.resolve(__dirname, '../node_modules/uswds/dist/css/uswds.min.css');
require('events').EventEmitter.defaultMaxListeners = 30;
// node_modules/uswds/uswds/dist/css/uswds.min.css
const filePathes = [];
if(process.env.NODE_ENV === 'production') {
  fs.readdir(distPath, (err, fileNames) => {
  
    fileNames.forEach(fileName => {
      if(fileName.indexOf('.compressed') > -1) return;
      if(fileName.indexOf('.map') > -1 ) return;
      filePathes.push(path.join(distPath, fileName));
    });
    filePathes.push(cssDist);
    filePathes.forEach(filePath => {
        const inp = fs.createReadStream(filePath);
        var writeStream = fs.createWriteStream(filePath + '.compressed');
        gzip = zlib.createGzip();
        inp.pipe(gzip)
          .on('error', () => {
            // handle error
          })
          .pipe(writeStream)
          .on('error', () => {
            // handle error
          }).on('finish', () => {
            console.log(filePath + ' compressed');
            fs.writeFileSync(filePath, fs.readFileSync(filePath + '.compressed'));
          });
    })
  })
}

