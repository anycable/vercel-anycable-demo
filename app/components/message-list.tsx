"use client";

import { useStore } from "@nanostores/react";
import { $messages } from "../stores/messages";
import { Message } from "./message";

export const MessageList = () => {
  const messages = useStore($messages);

  return (
    <div className="flex h-full flex-col justify-end gap-2 py-4">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      {!messages.length && (
        <p className="text-center text-sm text-gray-500">{`No messages have bees seen here recently. Don't be shy, send something!`}</p>
      )}
    </div>
  );
};
