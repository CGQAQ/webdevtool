export const httpMethodList = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "HEAD",
  "DELETE",
  "OPTIONS",
  "TRACE",
] as const;

export type HTTPMethod = typeof httpMethodList[number];

export interface Header {
  name: string;
  value: string;
}

export interface HTTPPayload {
  addr: string;
  method: HTTPMethod;
  headers: Header[];
  body: string;
}

export interface WSConnectPayload {
  addr: string;
}

export interface WSConnectResult {
  id: string;
  error: undefined | string;
}

export interface WSSendPayload {
  id: string;
  content: string;
}

export interface WSSendResult {
  error: string | undefined;
  id: string;
}

export type WSResponse = WSSendPayload;

export interface WSDisconnectPayload {
  id: string;
}

export const IPCChannels = {
  WSConnect: "ws_connect",
  WSSend: "ws_send",
  WSResponse: "ws_response",
  WSDisconnect: "ws_disconnect",
};
