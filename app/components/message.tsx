import { formatDateToHours } from "@/utils/format-date";
import { type VariantProps, cva } from "class-variance-authority";
import { SVGProps } from "react";

import { Avatar } from "./avatar";

type BaseMessage = {
  id: string;
  createdAt: string;
  body: string;
};

export type IMessage = IAIMessage | IUserMessage;

export type IUserMessage = {
  ai?: void;
  username: string;
  avatar?: string;
} & BaseMessage;

export type IAIMessage = { ai: true; loading?: boolean } & BaseMessage;

type Props<T> = {
  message: T;
  showName: boolean;
  showAvatar: boolean;
} & VariantProps<typeof _messageRoot>;

export const Message = ({
  message,
  ...rest
}: Props<IAIMessage | IUserMessage>) => {
  return (
    <div className={_messageRoot({ type: rest.type })}>
      {message.ai ? (
        <AIMessage message={message as IAIMessage} />
      ) : (
        <UserMessage message={message as IUserMessage} {...rest} />
      )}
    </div>
  );
};

const UserMessage = ({
  message,
  type,
  showName,
  showAvatar,
}: Props<IUserMessage>) => {
  return (
    <>
      {showAvatar && (
        <div className="size-8 absolute bottom-0 start-0 -translate-x-[calc(100%+8px)]">
          <Avatar username={message.username} />
        </div>
      )}
      {showName && (
        <span className="select-none truncate text-xs font-semibold text-zinc-400">
          {message.username}
        </span>
      )}
      <p>{message.body}</p>
      <time
        className={_messageTimestamp({ type })}
        title={message.createdAt}
        dateTime={message.createdAt}
      >
        {formatDateToHours(message.createdAt)}
      </time>
    </>
  );
};

const AIMessage = ({ message }: { message: IAIMessage }) => {
  return (
    <>
      <div className="size-8 absolute bottom-0 start-0 -translate-x-[calc(100%+8px)]">
        <Avatar username="" fallbackType="robot" />
      </div>
      <span className="select-none truncate text-xs font-semibold text-blue-400">
        AI Assistant
      </span>
      <p>{message.body}</p>
      <time
        className={_messageTimestamp({ type: "other" })}
        title={message.createdAt}
        dateTime={message.createdAt}
      >
        {formatDateToHours(message.createdAt)}
      </time>
    </>
  );
};

const _messageRoot = cva(
  [
    "relative max-w-[85%] md:max-w-[66%]",
    "flex flex-col gap-1",
    "rounded-md border p-2 pb-1 shadow",
  ],
  {
    variants: {
      type: {
        mine: "self-end border-red-200 bg-red-100",
        other: "self-start bg-white",
      },
    },
  },
);
const _messageTimestamp = cva("select-none text-right text-xs", {
  variants: {
    type: {
      mine: "text-red-400",
      other: "text-zinc-400",
    },
  },
});
