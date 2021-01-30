import { connection } from "websocket";
import { v4 as UUID } from "uuid";
import { Tab } from "./tab";

type SessionCommand =
  | "list_tabs"
  | "get_tab"

interface SessionRequest {
  seq: number;
  command: SessionCommand;
  tid?: string;
}

type SessionResponseType =
  | "response"
  | "update";

interface SessionResponse {
  seq: number;
  type: SessionResponseType;
  rsq?: number;
  data?: object | Array<unknown>;
  error?: number;
  reason?: string;
}

interface Error {
  error: number,
  reason: string,
}

interface SessionError {
  error: number,
  reason: string,
}

const RequestFormatError: SessionError = { error: 1, reason: "Request format is not correct!" };
const TabNotExistError: SessionError = {
  error: 2,
  reason: "The tid you provide with `get_tab` didn't match any tabs we have!",
};


export class Session {
  readonly id: string;
  connection: connection;
  tabs: Tab[];

  constructor(conn: connection) {
    this.id = UUID();
    this.connection = conn;
    this.listen();
  }

  listen() {
    this.connection.on("ping", (_, d) => {
      this.connection.pong(d);
    });
    this.connection.on("message", (data) => {
      if (data.type !== "utf8") {
        this.connection.sendUTF(JSON.stringify(RequestFormatError as SessionResponse));
      } else {
        const rdata: SessionRequest = JSON.parse(data.utf8Data);
        const seq = rdata.seq;
        const query = rdata.command;
        switch (query) {
          case "list_tabs":
            const arr = this.listTabs();
            const res = {
              seq: seq + 1,
              type: "response",
              rsq: seq,
              data: arr,
            } as SessionResponse;
            this.connection.sendUTF(JSON.stringify(res));
            break;
          case "get_tab":
            const tid = rdata.tid;
            const res_common = {
              seq: seq + 1,
              type: "response",
              rsq: seq,
            } as SessionResponse;
            if (tid) {
              try {
                const obj = this.getTab(tid);
                const res = {
                  ...res_common,
                  data: obj,
                } as SessionResponse;
              } catch (e) {
                this.connection.sendUTF(
                  {
                    ...res_common,
                    ...e,
                  },
                );
              }
            }
            break;
        }
      }
    });
  }

  listTabs(): string[] {
    return this.tabs.map(it => it.id);
  }

  getTab(tid: string): Object {
    const tab = this.tabs.find(it => it.id === tid);
    if (typeof tab === "undefined") {
      throw TabNotExistError;
    } else {
      return tab.toJSON();
    }
  }
}