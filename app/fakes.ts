"use client";

// TEMP: Fake data
import { $user } from "./stores/user";
import { addMessage } from "./stores/messages";

// Generate 5 random messages
const messages = [
  {
    id: "1",
    username: $user.get().username,
    body: "Hey, how are you?",
    createdAt: "2022-01-01T12:00:00Z",
  },
  {
    id: "2",
    username: "mary read",
    body: "I am doing well, thanks for asking! When people ask such questions, I feel very welcomed!",
    createdAt: "2022-01-01T12:05:00Z",
  },
  {
    id: "3",
    username: $user.get().username,
    body: "That is great to hear!",
    createdAt: "2022-01-01T12:10:00Z",
  },
  {
    id: "4",
    username: $user.get().username,
    body: "What's you up into these days?",
    createdAt: "2022-01-01T12:15:00Z",
  },
  {
    id: "5",
    username: "mary read",
    body: "Some real-time stuff",
    createdAt: "2022-01-01T12:20:00Z",
  },
];

// Call this async to avoid hydration errors
setTimeout(() => {
  for (const message of messages) {
    addMessage(message);
  }
}, 1000);
