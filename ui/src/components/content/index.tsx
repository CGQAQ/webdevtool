import React, { ChangeEvent, useState } from "react";
import "./style.css";

type ProtoType =
  | "HTTP"
  | "HTTPS"
  | "WEBSOCKET";

const protoList: ProtoType[] = [
  "HTTP",
  "HTTPS",
  "WEBSOCKET",
];

type TypeType =
  | "CLIENT"
  | "SERVER";
const typeList: TypeType[] = [
  "CLIENT",
  "SERVER",
];

type HeaderType = { id: number, name: string, value: string };

function Content() {
  const [proto, setProto] = useState<ProtoType>("HTTP");
  const [type, setType] = useState<TypeType>("CLIENT");
  const [addr, setAddr] = useState<string>("google.com");
  const [port, setPort] = useState<number>(80);
  const [btnText, setBtnText] = useState<string>("SEND");
  const [headers, setHeaders] = useState<HeaderType[]>([]);

  function onProtoChange(ev) {
    const proto: ProtoType = ev.target.value;
    setProto(proto);
    switch (proto) {
      case "HTTP":
        setPort(80);
        break;
      case "HTTPS":
        setPort(443);
        break;
      case "WEBSOCKET":
        setPort(80);
        break;
    }
  }

  function onTypeChange(ev) {
    const type: TypeType = ev.target.value;
    setType(type);
    switch (type) {
      case "CLIENT":
        setBtnText("SEND");
        break;
      case "SERVER":
        setBtnText("LISTEN");
        break;
    }
  }

  function doIt() {
    const data = {
      proto,
      type,
      addr,
      port,
    };
    console.log(data);
    console.log(headers);
  }

  function newHeader() {
    if (headers.every(it => it.name.length !== 0)) {
      setHeaders([...headers, { id: Date.now(), name: "", value: "" }]);
    }
  }

  function removeHeader(id: number) {
    const idx = headers.findIndex(it => it.id === id);
    const newHeaders = [...headers];
    newHeaders.splice(idx, 1);
    setHeaders(newHeaders);
  }

  function changeHeader(ev: ChangeEvent<HTMLInputElement>, id: number, name?: string, value?: string) {
    const idx = headers.findIndex(it => it.id === id);
    const newHeaders = [...headers];
    const oldHeader = headers[idx];
    newHeaders.splice(idx, 1, { ...oldHeader, name: name ?? oldHeader.name, value: value ?? oldHeader.value });
    if (headers.some(it => it.name === name && it.id !== id)) {
      if (ev.target.classList.contains("section-header__name")) {
        ev.target.value = oldHeader.name;
      }
      return;
    }
    setHeaders(newHeaders);
  }

  return (
    <main className="py-5">
      <section className="section-url">
        <label htmlFor="proto">Protocol</label>
        <select name="proto" id="proto" value={proto} onChange={onProtoChange}>
          {protoList.map(it => <option key={it} value={it}>{it}</option>)}
        </select>
        <label htmlFor="type">Type</label>
        <select name="type" id="type" value={type} onChange={onTypeChange}>
          {typeList.map(it => <option key={it} value={it}>{it}</option>)}
        </select>
        <input type="text" value={addr} onChange={ev => setAddr(ev.target.value)} />
        <input type="number" id="port" value={port} onChange={ev => setPort(parseInt(ev.target.value))} />
        <button onClick={doIt} className="px-2 font-medium border-2 border-green-200 py-1">{btnText}</button>
      </section>
      <section className="section-header">
        <div className="grid grid-cols-3">
          <div>header name</div>
          <div>header value</div>
          <button onClick={newHeader}>NEW</button>

          {headers.map(it => (
            <React.Fragment key={it.id}>
              <input className="section-header__name" type="text"
                     onBlur={ev => changeHeader(ev, it.id, ev.target.value, undefined)} />
              <input className="section-header__value" type="text"
                     onBlur={ev => changeHeader(ev, it.id, undefined, ev.target.value)} />
              <button onClick={() => removeHeader(it.id)}>DELETE</button>
            </React.Fragment>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Content;