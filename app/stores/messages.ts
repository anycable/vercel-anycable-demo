"use local";

import { atom } from "nanostores";

import type { Message as IMessage } from "../components/message";

import cable from "../cable";
import ChatChannel from "../channels/chat-channel";

export const $messages = atom<IMessage[]>([]);

// Initialize cable and subscribe to the channel
const chatChannel = new ChatChannel({ roomId: "42" });
cable.subscribe(chatChannel);

chatChannel.on("message", (message) => {
  addMessage(message);
});

export const addMessage = (message: IMessage) => {
  $messages.set([...$messages.get(), message]);
};

export const createMessage = async (body: string) => {
  chatChannel.sendMessage({ body });
};
