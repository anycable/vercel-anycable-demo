"use client";

import { atom, onSet } from "nanostores";
import type { Cable } from "@anycable/core";
import { createCable } from "@anycable/web";
import { $user } from "./user";

export const $cable = atom<Cable | void>();

onSet($user, async () => {
  const url = await fetch("/api/auth/cable", {
    method: "POST",
  })
    .then((r) => r.json())
    .then((r) => r.url);

  if ($cable.value) $cable.value.disconnect();

  $cable.set(
    createCable(url, {
      protocol: "actioncable-v1-ext-json",
      historyTimestamp: Math.floor(Date.now() / 1000) - 5 * 60, // 5 minutes ago
    }),
  );
});
