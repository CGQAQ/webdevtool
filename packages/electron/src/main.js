const electron = require("electron");

function createWindow() {
  const win = new electron.BrowserWindow({width: 800, height: 600});
  win.loadURL('http://localhost:3000');
  win.webContents.openDevTools();
}

electron.app.on("ready", createWindow);


(function() {
  const { ipcMain } = electron;
  ipcMain.handle("http_request", async (event, ...args) => {
    console.log(event, ...args);
  });

})();