"use client";

import { useState } from "react";
import { createMessage } from "../stores/messages";

export const NewMessageForm = () => {
  const [body, setBody] = useState("");

  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();

        if (body) {
          createMessage(body);
          setBody("");
        }
      }}
    >
      <div className="flex-grow">
        <label htmlFor="message" className="sr-only">
          Message
        </label>
        <input
          id="message"
          className="h-full w-full rounded-md border-0 px-2.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          autoComplete="off"
          placeholder="Message"
        />
      </div>

      <input
        type="submit"
        name="commit"
        value="Send"
        className="cursor-pointer rounded-md bg-red-500 px-5 py-2 text-white hover:bg-red-400"
      />
    </form>
  );
};
