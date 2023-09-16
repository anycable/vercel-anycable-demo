'use client';

import { useState } from "react";
import { createMessage } from "../stores/messages";

export const NewMessageForm = () => {
  const [body, setBody] = useState("");

  return (
    <div className="sticky bottom-0 p-2 border-gray-400 bg-gray-100 rounded-md mt-4 mr-4">
      <form className="flex flex-row"
        onSubmit={(e) => {
          e.preventDefault();

          if (body) {
            createMessage(body);
            setBody("");
          }
        }}
      >
        <input type="text" name="message" placeholder="Message" className="border-none flex-grow mr-2 px-2" autoComplete="off"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <input type="submit" name="commit" value="Send" className="rounded py-2 px-5 bg-red-600 text-white inline-block cursor-pointer hover:bg-red-500 transition-colors disabled:bg-red-100 disabled:cursor-no-allowed"
          disabled={!body}
        />
      </form>
    </div>
  );
};
