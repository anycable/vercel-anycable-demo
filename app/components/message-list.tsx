"use client";

import { $messages } from "@/stores/messages";
import { $user } from "@/stores/user";
import { useStore } from "@nanostores/react";
import { ComponentProps } from "react";

import { Message } from "./message";

export const MessageList = () => {
  const { m: messages } = useStore($messages);
  const user = useStore($user);

  return (
    <div className="flex h-full flex-col justify-end gap-2 py-4">
      {messages.map((message, i) => {
        // Base case scenario (because it's straightforward) is AI…
        let showName = true,
          showAvatar = true;
        let mine = false;
        let type: ComponentProps<typeof Message>["type"] = "other";

        // … but if it's not, we change the logic
        if (!message.ai) {
          mine = message.username === user.username;
          if (mine) type = "mine";

          const prevMessage = messages[i - 1];

          if (prevMessage?.ai) {
            showName = !mine;
            showAvatar = !mine;
          } else {
            /*
            Aligned with telegram:
            1. we show name for each first message of a user in a sequence of messages from them
            2. we show avatar for each last message of a user in a sequence of messages from them
            */
            showName = !mine && prevMessage?.username !== message.username;
            showAvatar = !mine && prevMessage?.username !== message.username;
          }
        }

        return (
          <Message
            key={message.id}
            messageIndex={i}
            type={type}
            showName={showName}
            showAvatar={showAvatar}
          />
        );
      })}
      {!messages.length && (
        <p className="text-center text-sm text-zinc-600">{`No messages have been seen here recently. Don't be shy, send something!`}</p>
      )}
    </div>
  );
};
