"use client";

import { useStore } from "@nanostores/react";
import { $messages } from "../stores/messages";
import { Message } from "./message";
import { $user } from "../stores/user";

export const MessageList = () => {
  const messages = useStore($messages);
  const user = useStore($user);

  return (
    <div className="flex h-full flex-col justify-end gap-2 py-4 pl-8">
      {messages.map((message, i) => {
        const mine = message.username === user.username;

        /*
        Aligned with telegram:
        1. we show name for each first message of a user in a sequence of messages from them
        2. we show avatar for each last message of a user in a sequence of messages from them
        */
        const showName =
          !mine && messages[i - 1]?.username !== message.username;
        const showAvatar =
          !mine && messages[i + 1]?.username !== message.username;

        return (
          <Message
            key={message.id}
            message={message}
            mine={mine}
            showName={showName}
            showAvatar={showAvatar}
          />
        );
      })}
      {!messages.length && (
        <p className="text-center text-sm text-gray-500">{`No messages have bees seen here recently. Don't be shy, send something!`}</p>
      )}
    </div>
  );
};
