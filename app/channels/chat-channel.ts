import type { ChannelEvents } from "@anycable/core";

import { AIMessageWithPossibleCustomUI } from "@/api/assistant/customUI";
import { Channel } from "@anycable/web";

type BaseMessage<Body = string> = {
  id: string;
  createdAt: string;
  body: Body;
};

export type IMessage = IAIMessage | IUserMessage;

export type IUserMessage = {
  ai?: void;
  username: string;
  avatar?: string;
} & BaseMessage;

export type IAIMessage = {
  ai: true;
  loading?: boolean;
} & BaseMessage<AIMessageWithPossibleCustomUI | string>;

export type ClientMessage = {
  body: string;
  history: string;
};

export type ServerMessage = {
  type: "create" | "update";
  msg: IMessage;
};
type ServerMessageTypes = ServerMessage["type"];
const serverMessageTypes: ServerMessageTypes[] = ["create", "update"];

export type ChatChannelParams = {
  roomId: string;
};

export interface ChatActions {
  sendMessage(message: ClientMessage): void;
}

interface ChatEvents extends ChannelEvents<ServerMessage> {
  create: (msg: IMessage) => void;
  update: (msg: IMessage) => void;
}

export default class ChatChannel extends Channel<
  ChatChannelParams,
  ServerMessage,
  ChatEvents,
  ChatActions
> {
  static identifier = "chat";

  receive(msg: ServerMessage) {
    if (serverMessageTypes.includes(msg.type)) this.emit(msg.type, msg.msg);
    else super.receive(msg);
  }

  sendMessage(message: ClientMessage) {
    this.perform("sendMessage", message);
  }
}
