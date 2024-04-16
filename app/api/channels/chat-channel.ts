import type { SentMessage } from "@/channels/chat-channel";
import type { IMessage, IUserMessage } from "@/components/message";
import type { ServerAction } from "@anycable/serverless-js";

import { ChatActions, ChatChannelParams } from "@/channels/chat-channel";
import { Channel, ChannelHandle } from "@anycable/serverless-js";
import { nanoid } from "nanoid";

import type { CableIdentifiers } from "../cable";

import { AIAssistant } from "../assistant/assistant";
import { broadcastTo } from "../cable";

type ActionsType = {
  [K in keyof ChatActions]: ServerAction<
    ChatActions[K],
    CableIdentifiers,
    {},
    IMessage,
    ChatChannelParams
  >;
};

interface Actions extends ActionsType {}

export default class ChatChannel
  extends Channel<CableIdentifiers, ChatChannelParams, IMessage>
  implements Actions
{
  constructor(private aiAssistant = new AIAssistant()) {
    super();
  }

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
    const { body, history } = data;

    if (!body) {
      throw new Error("Body is required");
    }

    console.log(
      `User ${handle.identifiers!.username} sent message: ${data.body}`,
    );

    const message: IUserMessage = {
      id: nanoid(),
      username: handle.identifiers!.username,
      body,
      createdAt: new Date().toISOString(),
    };
    const roomName = `room:${params.roomId}`;

    await broadcastTo(roomName, message);
    await this.aiAssistant.startChain(
      roomName,
      // Appending current message to the history
      history + `\n${handle.identifiers!.username}: ${body}`,
    );
  }
}
