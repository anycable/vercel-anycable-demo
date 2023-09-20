import { cx } from "class-variance-authority";
import { formatDateToHours } from "../utils/format-date";

export type Message = {
  id: string;
  username: string;
  avatar?: string;
  body: string;
  createdAt: string;
};

interface Props {
  message: Message;
  mine: boolean;
}

export const Message = ({ message, mine }: Props) => {
  return (
    <div
      className={cx(
        "flex max-w-[85%] flex-col gap-1 rounded-md border p-2 pb-1 shadow md:max-w-[66%]",
        mine ? "self-end border-red-200 bg-red-100" : "self-start bg-white",
      )}
    >
      {!mine && (
        <span className="select-none truncate text-xs font-semibold text-gray-400">
          {message.username}
        </span>
      )}
      <p>{message.body}</p>
      <time
        className={cx(
          mine ? "text-red-400" : "text-gray-400",
          "select-none text-right text-xs",
        )}
        title={message.createdAt}
        dateTime={message.createdAt}
      >
        {formatDateToHours(message.createdAt)}
      </time>
    </div>
  );
};
