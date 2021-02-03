const electron = require("electron");

function createWindow() {
  const win = new electron.BrowserWindow({ width: 800, height: 600 });
  win.loadURL("http://localhost:3000");
  win.webContents.openDevTools();
  win.menuBarVisible = false;
}

electron.app.on("ready", createWindow);

(function () {
  const { ipcMain } = electron;
  ipcMain.handle("http_request", async (event: unknown, ...args: unknown[]) => {
    console.log(event, ...args);
  });
})();
