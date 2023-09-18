"use client";

import { atom, onSet } from "nanostores";

import type { Message as IMessage } from "../components/message";

import ChatChannel from "../channels/chat-channel";
import { $cable } from "./cable";

export const $messages = atom<IMessage[]>([]);

export const addAutoScroll = (container: HTMLElement) =>
  onSet($messages, () => {
    const isCurrentlyAtBottom =
      container.scrollTop === container.scrollHeight - container.clientHeight;

    if (isCurrentlyAtBottom) {
      // Wrapping with timeout to scroll after new message is rendered
      setTimeout(() => container.scrollTo({ top: container.scrollHeight }));
    }
  });

export const $roomId = atom<string | void>();
const $channel = atom<ChatChannel | void>();

onSet($roomId, ({ newValue: roomId }) => {
  $channel.set(roomId ? new ChatChannel({ roomId }) : void 0);
});

onSet($channel, ({ newValue: chatChannel }) => {
  $messages.set([]);

  const prev = $channel.value;
  if (prev) $cable.value?.unsubscribe(prev);

  if (chatChannel) {
    $cable.value?.subscribe(chatChannel);
    chatChannel.on("message", (message) => {
      addMessage(message);
    });
  }
});

export const addMessage = (message: IMessage) => {
  $messages.set([...$messages.get(), message]);
};

export const createMessage = async (body: string) => {
  $channel.value?.sendMessage({ body });
};
