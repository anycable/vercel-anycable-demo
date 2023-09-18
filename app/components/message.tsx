import { useStore } from "@nanostores/react";
import { $user } from "../stores/user";
import { cx } from "class-variance-authority";

export type Message = {
  id: string;
  username: string;
  avatar?: string;
  body: string;
  createdAt: string;
};

interface Props {
  message: Message;
}

export const Message = ({ message }: Props) => {
  const { username } = useStore($user);
  const mine = username === message.username;

  return (
    <div
      className={cx(
        "flex max-w-[85%] flex-col gap-1 rounded-md border px-3 py-2 shadow md:max-w-[66%]",
        mine ? "self-end border-red-300 bg-red-200" : "self-start bg-white",
      )}
    >
      {!mine && (
        <span className="select-none truncate text-xs font-semibold text-gray-400">
          {message.username}
        </span>
      )}
      <p>{message.body}</p>
      {/* TODO: Add avatar and timestamps */}
    </div>
  );
};
