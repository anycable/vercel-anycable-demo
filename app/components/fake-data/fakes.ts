"use client";

import { nanoid } from "nanoid";
import { addMessage } from "stores/messages";
import { $user } from "stores/user";

// Generate 5 random messages
const messages = [
  {
    username: $user.get().username,
    body: "Hey, how are you?",
  },
  {
    username: "mary read",
    body: "I am doing well, thanks for asking! When people ask such questions, I feel very welcomed!",
  },
  {
    username: $user.get().username,
    body: "That is great to hear!",
  },
  {
    ai: true,
    loading: true,
    body: "Thinking…",
  },
  {
    username: "some-email@address",
    body: "Message with a cool avatar.",
  },
  {
    username: $user.get().username,
    body: "What's you up into these days?",
  },
  {
    username: "mary read",
    body: "Some real-time stuff",
  },
  {
    ai: true,
    body: "Beep-boop destroy all hoooomans",
  },
].map((msg, i, arr) => {
  const start = new Date().getTime() - arr.length * 60 * 1000;

  return {
    ...msg,
    id: nanoid(),
    createdAt: new Date(start + i * 60 * 1000).toISOString(),
  };
});

// Call this async to avoid hydration errors
setTimeout(() => {
  for (const message of messages) {
    // @ts-expect-error I really don't want to solve type errors for dev environment
    addMessage(message);
  }
}, 1000);
