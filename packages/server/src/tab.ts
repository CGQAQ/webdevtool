import { v4 as UUID } from "uuid";
import { ProtoType } from "./proto";

namespace HTTP {
  export interface Header {
    name: string;
    value: string;
  }

  export type HTTPMethod =
    | "GET"
    | "POST"
    | "HEAD"
    | "PUT"
    | "DELETE"
    | "CONNECT"
    | "OPTIONS"
    | "TRACE"
    | "PATCH"
    ;

  export interface Client {
    addr: string;
    method: HTTPMethod;
    headers: Header[];
    body?: string;
  }

  export interface Server {
  }
}

import HTTPS = HTTP;

namespace WebSocket {
  export interface Client {
    addr: string;
  }

  export interface Server {

  }
}

type ProtocolType =
  | "HTTP"
  | "WEBSOCKET"

/**
 * Store Tab data
 *
 * Such as protocol, data of specific protocol
 */
export class Tab {
  readonly id: string;
  private name: string;
  private protocol: ProtocolType;
  private extended_data: HTTP.Client | WebSocket.Client;

  constructor(proto: ProtocolType = "HTTP") {
    this.id = UUID();
    this.name = "New Tab";
    this.protocol = proto;
    if (proto === "HTTP") {
      this.extended_data = {
        addr: "https://baidu.com/",
        method: "GET",
        headers: [],
      } as HTTP.Client;
    } else {
      this.extended_data = {
        addr: "wss://echo.websocket.org",
      } as WebSocket.Client;
    }
  }

  getName() {
    return this.name;
  }

  getProtocol() {
    return this.protocol;
  }

  getHTTPField(): HTTP.Client | undefined {
    if (this.protocol === "HTTP") {
      return this.extended_data as HTTP.Client;
    }
    return undefined;
  }

  getWebSocketField(): WebSocket.Client | undefined {
    if (this.protocol === "WEBSOCKET") {
      return this.extended_data;
    }
    return undefined;
  }

  changeName(name: string) {
    if(name.length !== 0) {
      this.name = name;
    }
  }

  changeProtocol(proto: ProtocolType, extended_data: HTTP.Client | WebSocket.Client) {
    this.protocol = proto;
    this.extended_data = extended_data;
  }

  changeToHTTP(data: HTTP.Client) {
    this.protocol = "HTTP";
    this.extended_data = data;
  }

  changeToWebsocket(data: WebSocket.Client){
    this.protocol = "WEBSOCKET"
    this.extended_data = data;
  }

  toJSON(): Record<string, any> {
    const commonObj = {
      id: this.id,
      name: this.name,
      protocol: this.protocol,
    };
    if(this.protocol === "HTTP") {
      const edata = this.extended_data as HTTP.Client;
      const obj = {
        ...commonObj,
        ...edata,
      }
      return obj;
    } else if(this.protocol === "WEBSOCKET") {
      const edata = this.extended_data as WebSocket.Client;
      const obj = {
        ...commonObj,
        ...edata
      }
      return obj;
    } else {
      return null;
    }
  }

  toString() {
    const obj = this.toJSON();
    if(obj === null) {
      return "";
    } else {
      return JSON.stringify(obj);
    }
  }
}
