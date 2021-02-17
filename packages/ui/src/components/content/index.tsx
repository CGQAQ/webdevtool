import React, {
  ChangeEvent,
  useState,
} from "react";
import { v4 as UUID } from "uuid";
import "./style.css";
import {
  HTTPMethod,
  HTTPPayload,
  Header,
  httpMethodList,
  IPCChannels,
  WSConnectPayload,
  WSConnectResult,
  WSResponse,
  WSSendPayload,
  WSSendResult,
  WSDisconnectPayload,
} from "@webdevtool/common";

import type { ipcRenderer as ipcRendererType } from "electron";
import { send } from "process";
const {
  ipcRenderer,
}: {
  ipcRenderer: typeof ipcRendererType;
} = window.require("electron");

type ProtoType = "HTTP" | "WEBSOCKET";

interface Message {
  date: number;
  type: "send" | "receive";
  content: string;
}

const protoList: ProtoType[] = [
  "HTTP",
  "WEBSOCKET",
];

type TypeType = "CLIENT";
// | "SERVER";
const typeList: TypeType[] = [
  "CLIENT",
  // "SERVER",
];

type HeaderType = {
  id: string;
  name: string;
  value: string;
};

function Content() {
  const [id, setId] = useState<
    string | undefined
  >(undefined);
  const [
    proto,
    setProto,
  ] = useState<ProtoType>("HTTP");
  const [
    type,
    setType,
  ] = useState<TypeType>("CLIENT");
  const [
    addr,
    setAddr,
  ] = useState<string>(
    "http://baidu.com/"
  );
  const [
    port,
    setPort,
  ] = useState<number>(80);
  const [
    httpMethod,
    setHttpMethod,
  ] = useState<HTTPMethod>("GET");
  const [
    btnText,
    setBtnText,
  ] = useState<string>("SEND");
  const [
    headers,
    setHeaders,
  ] = useState<HeaderType[]>([]);
  const [
    body,
    setBody,
  ] = useState<string>("");

  const [
    rStatusCode,
    setRStatusCode,
  ] = useState<string>("");
  const [
    rStatusText,
    setRStatusText,
  ] = useState<string>("");
  const [
    rHeaders,
    setRHeaders,
  ] = useState<HeaderType[]>([]);
  const [
    rBody,
    setRBody,
  ] = useState<string>("");

  const [
    wsConversation,
    setWSConversation,
  ] = useState<Message[]>([]);

  function onProtoChange(ev) {
    const proto: ProtoType =
      ev.target.value;
    setProto(proto);
    switch (proto) {
      case "HTTP":
        setPort(80);
        setBtnText("Send");
        setAddr("https://baidu.com");
        break;
      case "WEBSOCKET":
        setPort(80);
        setBtnText("Connect");
        setAddr(
          "ws://echo.websocket.org"
        );
        break;
    }
  }

  function onHttpMethodChange(ev) {
    setHttpMethod(ev.target.value);
  }

  function onTypeChange(ev) {
    const type: TypeType =
      ev.target.value;
    setType(type);
    switch (type) {
      case "CLIENT":
        setBtnText("SEND");
        break;
      // case "SERVER":
      //   setBtnText("LISTEN");
      //   break;
    }
  }

  function onWSResponse(
    ev,
    res: WSResponse
  ) {
    console.log(wsConversation);
    console.log(res);
    setWSConversation([
      ...wsConversation,
      {
        content: res.content,
        date: Date.now(),
        type: "receive",
      },
    ]);
    console.log(wsConversation);
  }

  function doIt() {
    const data: HTTPPayload = {
      addr,
      method: httpMethod,
      headers,
      body,
    };
    setRStatusCode("");
    setRStatusText("");
    setRHeaders([]);
    setRBody("");
    if (proto === "HTTP") {
      ipcRenderer
        .invoke("http_request", data)
        .then((res) => {
          let r = res.status
            ? res
            : res.response;
          setRStatusCode(r.status);
          setRStatusText(r.statusText);
          setRHeaders(
            Object.entries(
              r.headers
            ).map((it) => ({
              id: UUID(),
              name: it[0],
              value: it[1] as string,
            }))
          );
          setRBody(r.body);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (proto === "WEBSOCKET") {
      // connect to server
      if (typeof id === "undefined") {
        ipcRenderer
          .invoke(
            IPCChannels.WSConnect,
            {
              addr: addr,
            } as WSConnectPayload
          )
          .then(
            (it: WSConnectResult) => {
              setBtnText("Disconnect");
              setId(it.id);
              ipcRenderer.addListener(
                IPCChannels.WSResponse,
                onWSResponse
              );
            }
          );
      } else {
        ipcRenderer
          .invoke(
            IPCChannels.WSDisconnect,
            {
              id,
            } as WSDisconnectPayload
          )
          .then((it) => {
            setBtnText("Connect");
            setId(undefined);
            ipcRenderer.removeListener(
              IPCChannels.WSResponse,
              onWSResponse
            );
          });
      }
    }
  }

  function sendMSG() {
    if (id !== undefined) {
      ipcRenderer
        .invoke(IPCChannels.WSSend, {
          id,
          content: body,
        } as WSSendPayload)
        .then(() => {
          setWSConversation([
            ...wsConversation,
            {
              date: Date.now(),
              type: "send",
              content: body,
            },
          ]);
        });
    }
  }

  function newHeader() {
    if (
      headers.every(
        (it) => it.name.length !== 0
      )
    ) {
      setHeaders([
        ...headers,
        {
          id: UUID(),
          name: "",
          value: "",
        },
      ]);
    }
  }

  function removeHeader(id: string) {
    const idx = headers.findIndex(
      (it) => it.id === id
    );
    const newHeaders = [...headers];
    newHeaders.splice(idx, 1);
    setHeaders(newHeaders);
  }

  function changeHeader(
    ev: ChangeEvent<HTMLInputElement>,
    id: string,
    name?: string,
    value?: string
  ) {
    const idx = headers.findIndex(
      (it) => it.id === id
    );
    const newHeaders = [...headers];
    const oldHeader = headers[idx];
    newHeaders.splice(idx, 1, {
      ...oldHeader,
      name: name ?? oldHeader.name,
      value: value ?? oldHeader.value,
    });
    if (
      headers.some(
        (it) =>
          it.name === name &&
          it.id !== id
      )
    ) {
      if (
        ev.target.classList.contains(
          "section-header__name"
        )
      ) {
        ev.target.value =
          oldHeader.name;
      }
      return;
    }
    setHeaders(newHeaders);
  }

  return (
    <main className="py-5">
      <section className="section-url">
        <label htmlFor="proto">
          Protocol
        </label>
        <select
          name="proto"
          id="proto"
          value={proto}
          onChange={onProtoChange}
        >
          {protoList.map((it) => (
            <option key={it} value={it}>
              {it}
            </option>
          ))}
        </select>
        {proto === "HTTP" ? (
          <section className="section-url">
            <label htmlFor="http-method">
              Protocol
            </label>
            <select
              name="http-method"
              id="http-method"
              value={httpMethod}
              onChange={
                onHttpMethodChange
              }
            >
              {httpMethodList.map(
                (it) => (
                  <option
                    key={it}
                    value={it}
                  >
                    {it}
                  </option>
                )
              )}
            </select>
          </section>
        ) : undefined}
        {/* Don't need for now */}
        {/*<label htmlFor="type">Type</label>*/}
        {/*<select name="type" id="type" value={type} onChange={onTypeChange}>*/}
        {/*  {typeList.map(it => <option key={it} value={it}>{it}</option>)}*/}
        {/*</select>*/}
        <input
          type="text"
          value={addr}
          onChange={(ev) =>
            setAddr(ev.target.value)
          }
        />
        {/*<input type="number" id="port" value={port} onChange={ev => setPort(parseInt(ev.target.value))} />*/}
        <button
          onClick={doIt}
          className="px-2 font-medium border-2 border-green-200 py-1"
        >
          {btnText}
        </button>
      </section>
      {headerSection(
        proto,
        newHeader,
        headers,
        changeHeader,
        removeHeader
      )}
      {/* Websocket sends and responses */}

      {conversationSection(
        proto,
        wsConversation
      )}

      <section id="section-body">
        <label htmlFor="section-body__text">
          {proto === "HTTP"
            ? "Body:"
            : "Message:"}
        </label>
        <textarea
          id="section-body__text"
          className="w-full border-2 bg-black"
          value={body}
          onChange={(ev) =>
            setBody(ev.target.value)
          }
        />
        {proto === "WEBSOCKET" ? (
          <button
            onClick={sendMSG}
            className="float-right text-2xl border-2 border-solid border-white"
          >
            Send
          </button>
        ) : undefined}
      </section>

      {responseSection(
        proto,
        rStatusCode,
        rStatusText,
        rHeaders,
        rBody
      )}
    </main>
  );
}

function conversationSection(
  proto: ProtoType,
  conversation: Message[]
) {
  if (proto === "WEBSOCKET") {
    return (
      <section
        id="section-conversation"
        className="flex flex-col"
      >
        {conversation.map((it) => {
          if (it.type === "send") {
            return (
              <div
                key={it.date}
                className="self-end"
              >
                <span>{it.type}</span>
                <span>
                  {it.content}
                </span>
              </div>
            );
          } else if (
            it.type === "receive"
          ) {
            return (
              <div
                key={it.date}
                className="self-start"
              >
                <span>{it.type}</span>
                <span>
                  {it.content}
                </span>
              </div>
            );
          }
        })}
      </section>
    );
  }
  return undefined;
}

function headerSection(
  proto: ProtoType,
  newHeader,
  headers,
  changeHeader,
  removeHeader
) {
  if (proto === "HTTP") {
    return (
      <section className="section-header">
        <div className="grid grid-cols-3">
          <div>header name</div>
          <div>header value</div>
          <button
            className="border-2 border-green-200"
            onClick={newHeader}
          >
            NEW
          </button>

          {headers.map((it) => (
            <React.Fragment key={it.id}>
              <input
                className="section-header__name"
                type="text"
                onBlur={(ev) =>
                  changeHeader(
                    ev,
                    it.id,
                    ev.target.value,
                    undefined
                  )
                }
              />
              <input
                className="section-header__value"
                type="text"
                onBlur={(ev) =>
                  changeHeader(
                    ev,
                    it.id,
                    undefined,
                    ev.target.value
                  )
                }
              />
              <button
                onClick={() =>
                  removeHeader(it.id)
                }
              >
                DELETE
              </button>
            </React.Fragment>
          ))}
        </div>
      </section>
    );
  }
  return undefined;
}

function responseSection(
  proto: ProtoType,
  rStatusCode,
  rStatusText,
  rHeaders,
  rBody
) {
  if (true || proto === "HTTP") {
    return (
      <>
        <section id="section-response-status">
          <span>{rStatusCode}</span>:{" "}
          <span>{rStatusText}</span>
        </section>
        <section id="section-response-header">
          <table>
            <thead>
              <tr>
                <th>name</th>
                <th>value</th>
              </tr>
            </thead>
            <tbody>
              {rHeaders.map((it) => {
                return (
                  <tr key={it.id}>
                    <td>{it.name}</td>
                    <td>{it.value}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
        <section
          id="section-response-body"
          className="border-t-2 border-white mt-4 pt-4"
        >
          <div>{rBody}</div>
        </section>
      </>
    );
  }
  return undefined;
}

export default Content;
