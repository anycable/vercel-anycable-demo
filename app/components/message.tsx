import { formatDateToHours } from "@/utils/format-date";
import { type VariantProps, cva } from "class-variance-authority";

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
} & VariantProps<typeof _messageBubble>;

export const Message = ({
  message,
  type,
  showAvatar,
  showName,
}: { showAvatar: boolean } & Props<IAIMessage | IUserMessage>) => {
  return (
    <div className={_root({ type })}>
      {type === "other" && (
        <div className="size-8 shrink-0">
          {showAvatar && (
            <Avatar
              username={message.ai ? "" : message.username}
              fallbackType={message.ai ? "robot" : "human"}
            />
          )}
        </div>
      )}

      <div className={_messageBubble({ type })}>
        {message.ai ? (
          <AIMessage message={message as IAIMessage} />
        ) : (
          <UserMessage
            message={message as IUserMessage}
            type={type}
            showName={showName}
          />
        )}
      </div>
    </div>
  );
};

const UserMessage = ({ message, type, showName }: Props<IUserMessage>) => {
  return (
    <>
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
      <span className="select-none truncate text-xs font-semibold text-emerald-400">
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

const _root = cva("flex", {
  variants: {
    type: {
      mine: "justify-end",
      other: "items-end gap-2",
    },
  },
});

const _messageBubble = cva(
  [
    "max-w-[85%] md:max-w-[66%]",
    "flex flex-col gap-1",
    "rounded-md border p-2 pb-1 shadow",
  ],
  {
    variants: {
      type: {
        mine: "border-red-200 bg-red-100",
        other: "bg-white",
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
