import type {
  ClientMessage,
  IMessage,
  IUserMessage,
  ServerMessage,
} from "@/channels/chat-channel";
import type { ServerAction } from "@anycable/serverless-js";

import { ChatActions, ChatChannelParams } from "@/channels/chat-channel";
import { Channel, ChannelHandle } from "@anycable/serverless-js";
import { nanoid } from "nanoid";

import type { CableIdentifiers } from "../cable";

import { AIAssistant } from "../assistant/assistant";
import { broadcastTo } from "../cable";
import { markdownToHtml } from "../utils/markdown";

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
  extends Channel<CableIdentifiers, ChatChannelParams, ServerMessage>
  implements Actions
{
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

  private _aiAssistant!: AIAssistant;
  private get aiAssistant(): AIAssistant | null {
    if (process.env.FIREWORKS_API_KEY) {
      if (!this._aiAssistant) this._aiAssistant = new AIAssistant();

      return this._aiAssistant;
    }

    return null;
  }

  async sendMessage(
    handle: ChannelHandle<CableIdentifiers>,
    params: ChatChannelParams,
    data: ClientMessage,
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
      body: await markdownToHtml(body),
      createdAt: new Date().toISOString(),
    };
    const roomName = `room:${params.roomId}`;

    await broadcastTo(roomName, { type: "create", msg: message });

    await this.aiAssistant?.startChain(
      roomName,
      handle.identifiers!.username + ": " + body,
      history,
    );
  }
}
