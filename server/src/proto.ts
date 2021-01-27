type ProtoType =
  | "HTTP"
  | "HTTPS"
  | "WEBSOCKET";
type SubtypeType =
  | "CLIENT"
  | "SERVER";

interface Request {
  seq: number;
  proto: ProtoType
  subtype: SubtypeType
}