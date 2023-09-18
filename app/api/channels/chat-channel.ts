import { Channel, ChannelHandle } from "@/lib/anycable/channel";
import type { CableIdentifiers } from "../cable";
import { broadcastTo } from "../cable";

import type { SentMessage } from "@/app/channels/chat-channel";
import type { Message as IMessage } from "../../components/message";

type ChatChannelParams = {
  roomId: string;
};

export default class ChatChannel extends Channel<
  CableIdentifiers,
  ChatChannelParams
> {
  async subscribed(
    handle: ChannelHandle<CableIdentifiers>,
    params: ChatChannelParams | null,
  ) {
    if (!params) {
      handle.reject();
      return;
    }

    if (!params.roomId) {
      handle.reject();
      return;
    }

    handle.streamFrom(`room:${params.roomId}`);
  }

  async sendMessage(
    handle: ChannelHandle<CableIdentifiers>,
    params: ChatChannelParams,
    data: SentMessage,
  ) {
    const { body } = data;

    if (!body) {
      throw new Error("Body is required");
    }

    console.log(
      `User ${handle.identifiers!.username} sent message: ${data.body}`,
    );

    const message: IMessage = {
      id: Math.random().toString(36).substr(2, 9),
      username: handle.identifiers!.username,
      body,
      createdAt: new Date().toISOString(),
    };

    await broadcastTo(`room:${params.roomId}`, message);
  }
}
