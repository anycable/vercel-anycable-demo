"use client";

import { atom, onMount, action } from "nanostores";
import type { Cable } from "@anycable/core";
import { createCable } from "@anycable/web";

export const $cable = atom<Cable | void>();

export const ensureCable = action($cable, "ensure", async (cable) => {
  if (cable.get()) return cable.get();

  const url = await fetch("/api/auth/cable", {
    method: "POST",
    credentials: "include",
  })
    .then((r) => r.json())
    .then((r) => r.url);

  cable.set(
    createCable(url, {
      protocol: "actioncable-v1-ext-json",
      historyTimestamp: Math.floor(Date.now() / 1000) - 5 * 60, // 5 minutes ago
    }),
  );

  return cable.get();
});
