import { atom } from "nanostores";

import { $user } from "./user";
import type { Message as IMessage } from "../components/message";

export const $messages = atom<IMessage[]>([]);

export const addMessage = (message: IMessage) => {
  $messages.set([...$messages.get(), message]);
};

export const createMessage = async (body: string) => {
  const message: IMessage = {
    id: Math.random().toString(36).substr(2, 9),
    username: $user.get().name,
    body,
    createdAt: new Date().toISOString(),
  };

  // async operation emulation
  await new Promise((resolve) => setTimeout(resolve, 0));

  addMessage(message);
};
