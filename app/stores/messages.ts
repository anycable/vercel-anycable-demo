"use client";

import { exists } from "@/utils/ts";
import { atom, computed, deepMap, onSet } from "nanostores";

import type { IMessage, IUserMessage } from "../components/message";

import ChatChannel from "../channels/chat-channel";
import { $cable } from "./cable";

export const $messages = deepMap<{ m: IMessage[] }>({ m: [] });

export const $publishableHistory = computed($messages, ({ m: messages }) => {
  let lastIndex = messages.length - 1;
  const messagesHistory: IUserMessage[] = [];
  while (true) {
    if (lastIndex < 0 || messagesHistory.length === 3) break;

    const message = messages[lastIndex];
    if (!message || message.ai) break;

    messagesHistory.push(message as IUserMessage);
    lastIndex--;
  }

  const result = messagesHistory
    .map((message) => `${message.username}: """${message.body}"""`)
    .join("\n");

  return result;
});

export const addAutoScroll = (container: HTMLElement) =>
  onSet($messages, () => {
    /*
    Marvelous thing: at some point `scrollTop` started to give me… fractional numbers!
    Let's pretend that 5 pixel difference doesn't, really matter here.
    */
    const isCurrentlyAtBottom =
      Math.abs(
        container.scrollTop - (container.scrollHeight - container.clientHeight),
      ) < 5;

    if (isCurrentlyAtBottom) {
      // Wrapping with timeout to scroll after new message is rendered
      setTimeout(() => container.scrollTo({ top: container.scrollHeight }));
    }
  });

export const $roomId = atom<string | void>();

export const $channel = computed([$cable, $roomId], (cable, roomId) => {
  if (!cable || !roomId) return;

  $channel.value?.disconnect();

  $messages.set({ m: [] });
  const channel = new ChatChannel({ roomId });
  cable.subscribe(channel);
  channel.on("message", (message) => {
    addMessage(message);
  });

  return channel;
});

export const addMessage = (message: IMessage) => {
  const { m: messages } = exists($messages.value);
  $messages.setKey(`m[${messages.length}]`, message);
};

export const updateMessage = (message: IMessage) => {
  const { m: messages } = exists($messages.value);
  let msgToUpdate: IMessage | null = null,
    index: null | number = null;
  for (let i = 0; i < messages.length; i++) {
    const curr = messages[i];
    if (curr?.id === message.id) {
      index = i;
      msgToUpdate = curr;
      break;
    }
  }

  if (msgToUpdate && index !== null) {
    $messages.setKey(`m[${index}]`, message);
  }
};

export const createMessage = async (body: string, history: string) => {
  $channel.value?.sendMessage({ body, history });
};
