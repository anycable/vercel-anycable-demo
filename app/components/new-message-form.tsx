"use client";

import { useState } from "react";
import { createMessage } from "../stores/messages";
import { Button } from "./button";
import { useStore } from "@nanostores/react";
import { $cableState } from "../stores/cable";

export const NewMessageForm = () => {
  const [body, setBody] = useState("");
  const state = useStore($cableState);
  const submitDisabled = state !== "idle" && state !== "connected";

  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();

        if (body && !submitDisabled) {
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

      <Button disabled={submitDisabled}>Send</Button>
    </form>
  );
};
