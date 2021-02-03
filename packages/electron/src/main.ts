import {app, BrowserWindow, ipcMain} from 'electron';
import axios from 'axios';

const httpMethodList = [
    "GET"
    , "POST"
    , "HEAD"
    , "PUT"
    , "DELETE"
    , "OPTIONS"
    , "PATCH"
    , 'PURGE'
    , 'LINK'
    , 'UNLINK'
] as const;

type HTTPMethod = typeof httpMethodList[number];

interface HTTPPayload {
    addr: string,
    method: HTTPMethod,
    headers: Record<string, string>[],
    body: string,
}

(function () {
    ipcMain.handle("http_request", async (event: unknown, payload: HTTPPayload, ...args: unknown[]) => {
        return axios.request({
            url: payload.addr,
            method: payload.method,
            headers: payload.headers,
            data: payload.body
        }).then(it => ({...it, config: undefined, request: undefined}));
    });
})();

function createWindow() {
    const win = new BrowserWindow({
        width: 800, height: 600, webPreferences: {
            nodeIntegration: true
        }
    });
    win.loadURL("http://localhost:3000");
    win.webContents.openDevTools();
    win.menuBarVisible = false;
}

app.on("ready", createWindow);
