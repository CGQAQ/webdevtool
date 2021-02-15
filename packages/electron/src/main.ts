import { app, BrowserWindow, ipcMain } from "electron";
import got from "got";
import { resolve } from "path";

const httpMethodList = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "HEAD",
  "DELETE",
  "OPTIONS",
  "TRACE",
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
      return new Promise(async (resolve, _) => {
        const res = await got(payload.addr, {
          method: payload.method,
          headers: payload.headers.reduce<Record<string, string>>(
            (last: Record<string, string>, cur: Header) => {
              last[cur.name] = cur.value;
              return last;
            },
            {}
          ),
          body: payload.body.length === 0 ? undefined : payload.body,
        });
        const body = res.body;
        const headers = res.headers;

        resolve({
          status: res.statusCode,
          statusText: res.statusMessage,
          body,
          headers,
        });
      });
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
