const zlib = require('zlib');
const fs = require('fs');
const path = require('path');
const distPath = path.resolve(__dirname, '../assets/dist');
const cssDist = path.resolve(__dirname, '../node_modules/uswds/dist/css/uswds.min.css');
require('events').EventEmitter.defaultMaxListeners = 30;

//MIT © Kevin Mårtensson
const isGzip = buf => {
	if (!buf || buf.length < 3) {
		return false;
	}

	return buf[0] === 0x1F && buf[1] === 0x8B && buf[2] === 0x08;
};
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
        if(isGzip(fs.readFileSync(filePath))) {
          console.log(filePath + ' is already gzipped');
          return;
        }
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

