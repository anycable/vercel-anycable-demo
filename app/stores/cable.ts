import { computed } from "nanostores";
import { $user } from "./user";
import { createCable } from "@anycable/web";

const url = process.env.NEXT_PUBLIC_CABLE_URL || "ws://localhost:8080/cable";

export const $cable = computed($user, (user) =>
  createCable(`${url}?username=${user.username}`, {
    protocol: "actioncable-v1-ext-json",
    historyTimestamp: Math.floor(Date.now() / 1000) - 5 * 60, // 5 minutes ago
  }),
);
