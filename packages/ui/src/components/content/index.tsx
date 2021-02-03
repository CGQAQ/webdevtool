import React, {ChangeEvent, useState} from "react";
import {v4 as UUID} from 'uuid';
import "./style.css";

const {ipcRenderer} = window.require("electron");

type ProtoType =
    | "HTTP"
    | "WEBSOCKET";

const protoList: ProtoType[] = [
    "HTTP",
    "WEBSOCKET",
];

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

type TypeType =
    | "CLIENT";
// | "SERVER";
const typeList: TypeType[] = [
    "CLIENT",
    // "SERVER",
];

type HeaderType = { id: number, name: string, value: string };

function Content() {
    const [proto, setProto] = useState<ProtoType>("HTTP");
    const [type, setType] = useState<TypeType>("CLIENT");
    const [addr, setAddr] = useState<string>("http://baidu.com");
    const [port, setPort] = useState<number>(80);
    const [httpMethod, setHttpMethod] = useState<HTTPMethod>("GET");
    const [btnText, setBtnText] = useState<string>("SEND");
    const [headers, setHeaders] = useState<HeaderType[]>([]);
    const [body, setBody] = useState<string>("");

    const [rStatusCode, setRStatusCode] = useState<string>("");
    const [rStatusText, setRStatusText] = useState<string>("");
    const [rHeaders, setRHeaders] = useState<HeaderType[]>([]);
    const [rBody, setRBody] = useState<string>("");

    function onProtoChange(ev) {
        const proto: ProtoType = ev.target.value;
        setProto(proto);
        switch (proto) {
            case "HTTP":
                setPort(80);
                break;
            case "WEBSOCKET":
                setPort(80);
                break;
        }
    }

    function onHttpMethodChange(ev) {
        setHttpMethod(ev.target.value);
    }

    function onTypeChange(ev) {
        const type: TypeType = ev.target.value;
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

    function doIt() {
        const data = {
            addr,
            method: httpMethod,
            headers,
            body,
        };
        if (proto === 'HTTP') {
            console.log("=-----------------------")
            ipcRenderer.invoke("http_request", data)
                .then(res => {
                    setRStatusCode(res.status);
                    setRStatusText(res.statusText);
                    setRHeaders(Object.entries(res.headers).map(it => ({
                        id: UUID(),
                        name: it[0],
                        value: it[1] as string
                    })));
                    setRBody(res.data);
                }).catch(err => console.warn(err))
        }
    }

    function newHeader() {
        if (headers.every(it => it.name.length !== 0)) {
            setHeaders([...headers, {id: UUID(), name: "", value: ""}]);
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
        newHeaders.splice(idx, 1, {...oldHeader, name: name ?? oldHeader.name, value: value ?? oldHeader.value});
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
                {
                    proto === "HTTP" ?
                        <section className="section-url">
                            <label htmlFor="http-method">Protocol</label>
                            <select name="http-method" id="http-method" value={httpMethod}
                                    onChange={onHttpMethodChange}>
                                {
                                    httpMethodList.map(it => <option key={it} value={it}>{it}</option>)
                                }
                            </select>
                        </section>
                        :
                        undefined
                }
                {/* Don't need for now */}
                {/*<label htmlFor="type">Type</label>*/}
                {/*<select name="type" id="type" value={type} onChange={onTypeChange}>*/}
                {/*  {typeList.map(it => <option key={it} value={it}>{it}</option>)}*/}
                {/*</select>*/}
                <input type="text" value={addr} onChange={ev => setAddr(ev.target.value)}/>
                {/*<input type="number" id="port" value={port} onChange={ev => setPort(parseInt(ev.target.value))} />*/}
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
                                   onBlur={ev => changeHeader(ev, it.id, ev.target.value, undefined)}/>
                            <input className="section-header__value" type="text"
                                   onBlur={ev => changeHeader(ev, it.id, undefined, ev.target.value)}/>
                            <button onClick={() => removeHeader(it.id)}>DELETE</button>
                        </React.Fragment>
                    ))}
                </div>
            </section>

            <section id="section-body">
                <label htmlFor="section-body__text">Body</label>
                <textarea id="section-body__text" className="w-full border-2" value={body}
                          onChange={(ev) => setBody(ev.target.value)}/>
            </section>

            <section id="section-response-status">
                <span>{rStatusCode}</span>: <span>{rStatusText}</span>
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
                    {
                        rHeaders.map(it => {
                            return (
                                <tr key={it.id}>
                                    <td>{it.name}</td>
                                    <td>{it.value}</td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>
            </section>
            <section id="section-response-body">
                <div>{rBody}</div>
            </section>
        </main>
    );
}

export default Content;