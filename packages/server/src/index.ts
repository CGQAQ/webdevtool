import * as http from "http";
import * as websocket from "websocket";
import { Session } from "./session";
const WebsocketServer = websocket.server;

const httpServer = http.createServer(
  (req, res) => {
    if (!req.headers.upgrade){
      res.write("Please connect as websocket!");
      res.end();
    }
  }
);
httpServer.listen(9999, () => {
  console.log("server started at port 9999");
});


const websocketServer = new WebsocketServer({
  httpServer: httpServer,
  // You should not use autoAcceptConnections for production
  // applications, as it defeats all standard cross-origin protection
  // facilities built into the protocol and the browser.  You should
  // *always* verify the connection's origin and decide whether or not
  // to accept it.
  autoAcceptConnections: false
});

websocketServer.on("request", (request) => {
  const connection = request.accept(undefined, request.origin);
  console.log((new Date()) + ' Connection accepted.');

  new Session(connection);

  connection.on('close', function(reasonCode, description) {
    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
  });
})