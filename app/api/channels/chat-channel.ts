import { Channel, ChannelHandle } from "@/lib/anycable/channel";
import type { CableIdentifiers } from "../cable";
import { broadcastTo } from "../cable";

type ChatChannelParams = {
  roomId: string;
};

export default class ChatChannel extends Channel<
  CableIdentifiers,
  ChatChannelParams
> {
  async subscribed(
    handle: ChannelHandle<CableIdentifiers>,
    params: ChatChannelParams | null
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
    data: { content: string }
  ) {
    const { content } = data || {};

    if (!content) {
      throw new Error("Content is required");
    }

    console.log(
      `User ${handle.identifiers!.username} sent message: ${data.content}`
    );

    broadcastTo(`room:${params.roomId}`, {
      username: handle.identifiers!.username,
      content: data.content,
    });
  }
}
