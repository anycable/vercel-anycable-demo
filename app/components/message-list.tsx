"use client";

import { useStore } from '@nanostores/react'
import { $messages } from "../stores/messages";
import { Message } from "./message";

export const MessageList = () => {
  const messages = useStore($messages)

  return (
    <div className="flex-col flex overflow-y-scroll mr-4 flex-grow justify-end">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
};
