"use client";

import { useStore } from "@nanostores/react";
import TeenyiconsSendOutline from "~icons/teenyicons/send-outline";

import { $cableState } from "../stores/cable";
import { $publishableHistory, createMessage } from "../stores/messages";
import { Button } from "./button";

export const NewMessageForm = () => {
  const state = useStore($cableState);
  const submitDisabled = state !== "idle" && state !== "connected";
  const history = useStore($publishableHistory);

  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const body = (form.elements.namedItem("message") as HTMLInputElement)
          .value;

        if (body && !submitDisabled) {
          createMessage(body, history);
          form.reset();
        }
      }}
    >
      <input type="hidden" name="history" value={history} />
      <div className="flex-grow">
        <label>
          <span className="sr-only">Message</span>
          <input
            name="message"
            className="h-full w-full rounded-md border-0 px-2.5 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 sm:text-sm sm:leading-6"
            autoComplete="off"
            placeholder="Message"
          />
        </label>
      </div>

      <Button
        className="inline-flex items-center gap-2 pe-4"
        disabled={submitDisabled}
      >
        <span>Send</span>
        <TeenyiconsSendOutline />
      </Button>
    </form>
  );
};
