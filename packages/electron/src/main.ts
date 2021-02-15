import { app, BrowserWindow, ipcMain } from "electron";
import axios from "axios";

const httpMethodList = [
  "GET",
  "POST",
  "HEAD",
  "PUT",
  "DELETE",
  "OPTIONS",
  "PATCH",
  "PURGE",
  "LINK",
  "UNLINK",
] as const;

type HTTPMethod = typeof httpMethodList[number];

interface Header {
  name: string;
  value: string;
}

interface HTTPPayload {
  addr: string;
  method: HTTPMethod;
  headers: Header[];
  body: string;
}

(function () {
  ipcMain.handle(
    "http_request",
    async (event: unknown, payload: HTTPPayload, ...args: unknown[]) => {
      return axios
        .request({
          url: payload.addr,
          method: payload.method,
          headers: payload.headers.reduce<Record<string, string>>(
            (last: Record<string, string>, cur: Header) => {
              last[cur.name] = cur.value;
              return last;
            },
            {}
          ),
          data: payload.body,
        })
        .then((it) => ({ ...it, config: undefined, request: undefined }))
        .catch((reason) => ({
          ...reason,
          config: undefined,
          request: undefined,
        }));
    }
  );
})();

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  win.loadURL("http://localhost:3000");
  win.webContents.openDevTools();
  win.menuBarVisible = false;
}

app.on("ready", createWindow);
