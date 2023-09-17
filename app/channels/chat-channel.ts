import { Channel } from "@anycable/web";
import type { Message as IMessage } from "../components/message";

export type SentMessage = {
  body: string;
};

type ChatChannelParams = {
  roomId: string;
};

export default class ChatChannel extends Channel<ChatChannelParams, IMessage> {
  static identifier = "chat";

  sendMessage(message: SentMessage) {
    this.perform("sendMessage", message);
  }
}
