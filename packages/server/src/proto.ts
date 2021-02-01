export type ProtoType =
  | "HTTP"
  | "HTTPS"
  | "WEBSOCKET";
export type SubtypeType =
  | "CLIENT"
  | "SERVER";

interface Request {
  seq: number;
  proto: ProtoType
  subtype: SubtypeType
}