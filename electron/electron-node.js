const { app, BrowserWindow, ipcMain } = require('electron')
const {handleGetRequest, handlePostRequest} = require('./api/entryPoints');
const {
  getFile,
  setFile,
  unsetFile,
  getDirFiles,
  createDir,
  removeDir
} = require('./utils/file-io');

const objectTypes = [
  'deck',
  'cardBody',
  'studySession'
]
const defaultFiles = [
  'user',
  'studyHistory',
]

async function initializeDataLayout() {
  let formatted;
  try {
    formatted = await getFile('formatted');
  } catch(e) {
    formatted = false;
  }
  if (formatted) return;
  // await Promise.all(objectTypes.map((objName) => {
  //   return removeDir(objName, true);
  // }));
  // await removeDir('studyHistory', true);
  // await unsetFile('user');

  await Promise.all(objectTypes.map((objName) => {
    return createDir(objName, true);
  }));
  await Promise.all(defaultFiles.map(fileName => {
    return setFile(fileName, '{}');
  }));

  await setFile('formatted', 'true');
}

async function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    }
  })
  await initializeDataLayout();
  // and load the me.html of the app.
  win.loadFile('me.html')
}
app.allowRendererProcessReuse = true;
app.whenReady().then(createWindow)

ipcMain.handle('api', async (e, data) => {
  const path = data.url;
  const body = data.body;
  if (!Object.keys(body).length) {
    return JSON.stringify(await handleGetRequest(path));
  } else {
    return JSON.stringify(await handlePostRequest(path, body));
  }
});
