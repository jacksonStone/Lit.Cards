const fs = require('fs');
const { app } = require('electron');
const nodePath = require('path');

const whereDataBe = app.getPath('userData');

function getFile(path, tolerateErrors) {
  return new Promise((resolve, reject) => {
    fs.readFile(nodePath.join(whereDataBe, path), 'utf16le', (err, data) => {
      if(err && !tolerateErrors) {
        reject(err);
      }
      resolve(data);
    })
  })
}

function setFile(path, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(nodePath.join(whereDataBe, path), data, 'utf16le', (err, data) => {
      if(err) {
        reject(err);
      }
      resolve(data);
    });
  })
}

function unsetFile(path) {
  return new Promise((resolve, reject) => {
    fs.unlink(nodePath.join(whereDataBe, path), (err) => {
      if (err) return reject(err);
      resolve();
    });
  })
}

function getDirFiles(path, tolerateError) {
  return new Promise((resolve, reject) => {
    fs.readdir(nodePath.join(whereDataBe, path), (err, data) => {
      if(err && !tolerateError) {
        reject(err);
      }
      resolve(data);
    });
  });
}

async function getAllFileContentInDir(path, tolerateErrors) {
  const files = await getDirFiles(path, tolerateErrors);
  return Promise.all(files.map(fileName => {
    return getFile(`${path}/${fileName}`, tolerateErrors);
  }));
}

function createDir(path, tolerateError) {
  return new Promise((resolve, reject) => {
    fs.mkdir(nodePath.join(whereDataBe, path), (err) => {
      if(err && !tolerateError) {
        reject(err);
      }
      resolve();
    });
  });
}

function pathExists(path) {
  return new Promise((resolve, reject) => {
    // Check if the file exists in the current directory.
    fs.access(nodePath.join(whereDataBe, path), fs.constants.F_OK, (err) => {
      if(!err) {
        resolve(true);
      }
      else {
        resolve(false);
      }
    });
  });
}

function removeDir(path, tolerateError) {
  return new Promise((resolve, reject) => {
    fs.rmdir(nodePath.join(whereDataBe, path), {recursive: true}, (err) => {
      if(err && !tolerateError) {
        console.log("ERROR", err, tolerateError);
        reject(err);
      }
      resolve();
    });
  });
}

module.exports = {
  getFile,
  setFile,
  unsetFile,
  getDirFiles,
  pathExists,
  getAllFileContentInDir,
  createDir,
  removeDir
};
