import { app, BrowserWindow, ipcMain, Menu } from 'electron'
import path from 'path'
import fs from 'fs'

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let mainWindow;

const createWindow = (): void => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, "bridge.js") // use a preload script
    }
  });

  var menu = Menu.buildFromTemplate([
      {
          label: 'Bookkeeping',
          click() {
              mainWindow.loadURL(`${MAIN_WINDOW_WEBPACK_ENTRY}#/bookkeeping`);
          }
      },
      {
          label: 'Upkeep',
          click() {
              mainWindow.loadURL(`${MAIN_WINDOW_WEBPACK_ENTRY}#/upkeep`);
          }
      },
      {
          label: 'Consumption Control',
          submenu: [
              {
                  label: 'Car',
                  submenu: [
                      {
                        label:'Fuel',
                        click() {
                            mainWindow.loadURL(`${MAIN_WINDOW_WEBPACK_ENTRY}#/car/fuel`);
                        }
                      }
                  ]
              },
              {
                  label: 'Home',
                  submenu: [
                      {
                        label:'Electricity',
                        click() {
                            mainWindow.loadURL(`${MAIN_WINDOW_WEBPACK_ENTRY}#/home/electricity`);
                        }
                      },
                      {
                        label:'Gas',
                        click() {
                            mainWindow.loadURL(`${MAIN_WINDOW_WEBPACK_ENTRY}#/home/gas`);
                        }
                      },
                      {
                        label:'Water and Heating',
                        click() {
                            mainWindow.loadURL(`${MAIN_WINDOW_WEBPACK_ENTRY}#/home/heating`);
                        }
                      }
                  ]
              }
          ]
      },
      {
          label:'Exit',
          click() {
              app.quit();
          }
      }
  ])
  Menu.setApplicationMenu(menu);

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.maximize();
  // Open the DevTools.
  if(!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

const ROOT_PATH = "./storage";

if (!fs.existsSync(ROOT_PATH)){
  fs.mkdirSync(ROOT_PATH);
}

ipcMain.on("loadFromStorageChannel", (event, request) => {
  console.log("loadFromStorageChannel", request);
  if (!fs.existsSync(`${ROOT_PATH}/${request.path}`)){
    fs.mkdirSync(`${ROOT_PATH}/${request.path}`);
  }
  request.data = fs.readdirSync(`${ROOT_PATH}/${request.path}`)
    .map(i => fs.readFileSync(`${ROOT_PATH}/${request.path}/${i}`))
    .join('')
  mainWindow.webContents.send("fromStorageChannel", request);
});

ipcMain.on("appendToStorageChannel", (event, request) => {
  console.log("appendToStorageChannel", request);
  if (!fs.existsSync(`${ROOT_PATH}/${request.path}`)){
    fs.mkdirSync(`${ROOT_PATH}/${request.path}`);
  }
  fs.appendFileSync(`${ROOT_PATH}/${request.path}/${request.file}.list.json`, `${request.data}\n`);
  mainWindow.webContents.send("fromStorageChannel", request);
});

ipcMain.on("readFile", (event, request) => {
  console.log("readFile", request);
  if (request.path && !fs.existsSync(`${ROOT_PATH}/${request.path}`)){
    fs.mkdirSync(`${ROOT_PATH}/${request.path}`);
  }
  mainWindow.webContents.send(`readFile-${request.eventId}`, fs.readFileSync(`${ROOT_PATH}/${request.filename}`));
});

ipcMain.on("listFiles", (event, request) => {
  console.log("listFiles", request);
  if (!fs.existsSync(`${ROOT_PATH}/${request.path}`)){
    fs.mkdirSync(`${ROOT_PATH}/${request.path}`);
  }
  const data = fs.readdirSync(`${ROOT_PATH}/${request.path}`);

  mainWindow.webContents.send(`listFiles-${request.eventId}`, data);
});

ipcMain.on("readDirectory", (event, request) => {
  console.log("readDirectory", request);
  if (!fs.existsSync(`${ROOT_PATH}/${request.path}`)){
    fs.mkdirSync(`${ROOT_PATH}/${request.path}`);
  }
  const data = fs.readdirSync(`${ROOT_PATH}/${request.path}`)
    .map(i => fs.readFileSync(`${ROOT_PATH}/${request.path}/${i}`))
    .join('')
  mainWindow.webContents.send(`readDirectory-${request.eventId}`, data);
});
