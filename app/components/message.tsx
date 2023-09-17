import { useStore } from '@nanostores/react'
import { $user } from '../stores/user'

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
  const { name } = useStore($user)
  const mine = name === message.username

  return (
    <div
      className={`ml-4 rounded text-sm lg:text-base border p-2 mt-2 flex flex-col ${
        mine ? "border-teal-300 self-start" : "border-gray-300 self-end"
      }`}
    >
      <p>{message.body}</p>
      <span className={`text-gray-400 cursor-pointer hover:opacity-75 text-xs lg:text-sm truncate mt-1 ${
          mine
            ? "self-start"
            : "self-end"
        }`}
      >{mine ? "Me" : message.username}</span>
      {/* TODO: Add avatar and timestamps */}
    </div>
  );
};
