"use client";

import { atom, onMount, onSet } from "nanostores";

import type { Message as IMessage } from "../components/message";

import cable from "../cable";
import ChatChannel from "../channels/chat-channel";

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

// Initialize cable and subscribe to the channel
const chatChannel = new ChatChannel({ roomId: "42" });
cable.subscribe(chatChannel);

onMount($messages, () => {
  // Only subscribing in browser
  if (typeof window !== "undefined") {
    return chatChannel.on("message", (message) => {
      addMessage(message);
    });
  }
});

export const addMessage = (message: IMessage) => {
  $messages.set([...$messages.get(), message]);
};

export const createMessage = async (body: string) => {
  chatChannel.sendMessage({ body });
};
