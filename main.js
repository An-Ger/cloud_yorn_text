const { app, BrowserWindow } = require("electron");
const isDev = require("electron-is-dev");
let mainWindow;
const Store = require('electron-store');
Store.initRenderer();
app.on("ready", () => {
  mainWindow = new BrowserWindow({
    window: 1024,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      enableRemoteModule: true
    },
  });
  const urlLocation = isDev ? "http://localhost:3000" : "dummyurl";
  mainWindow.loadURL(urlLocation);
});
