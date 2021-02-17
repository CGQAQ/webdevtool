import { app, BrowserWindow, ipcMain } from "electron";
import got from "got";
import Websocket from "ws";
import { v4 as UUID } from "uuid";
import {
  Header,
  HTTPPayload,
  WSConnectPayload,
  WSConnectResult,
  WSSendPayload,
  WSSendResult,
  WSResponse,
  IPCChannels,
  WSDisconnectPayload,
} from "@webdevtool/common";

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

  interface WSConnection {
    id: string; // uuid
    conn: Websocket; // real connection
  }

  const wsConnList: WSConnection[] = [];

  ipcMain.handle(IPCChannels.WSConnect, (ev, payload: WSConnectPayload) => {
    const id = UUID();
    const conn = new Websocket(payload.addr);
    wsConnList.push({ id, conn });
    conn.on("message", (data) => {
      ev.sender.send(IPCChannels.WSResponse, {
        id,
        content: data.toString(),
      } as WSResponse);
    });
    return { id } as WSConnectResult;
  });

  ipcMain.handle(IPCChannels.WSSend, (ev, payload: WSSendPayload) => {
    const conn = wsConnList.find((it) => it.id === payload.id);
    return new Promise((resolve, reject) => {
      if (conn) {
        conn.conn.send(payload.content, (err) => {
          if (err) {
            reject({ error: err.message, id: conn.id } as WSSendResult);
          }
          resolve(undefined);
        });
      }
    });
  });

  ipcMain.handle(
    IPCChannels.WSDisconnect,
    (ev, payload: WSDisconnectPayload) => {
      const idx = wsConnList.findIndex((it) => it.id === payload.id);
      wsConnList.splice(idx, 1);
      return Promise.resolve();
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
