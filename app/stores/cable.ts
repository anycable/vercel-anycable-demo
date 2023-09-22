"use client";

import { atom, onSet } from "nanostores";
import type { Cable } from "@anycable/core";
import { createCable } from "@anycable/web";
import { $user } from "./user";

export const $cable = atom<Cable | void>();
export const $cableState = atom<CableState>("connecting");
export type CableState = Cable["state"];

onSet($user, async () => {
  const url = await fetch("/api/auth/cable", {
    method: "POST",
  })
    .then((r) => r.json())
    .then((r) => r.url);

  if ($cable.value) $cable.value.disconnect();

  const cable = createCable(url, {
    protocol: "actioncable-v1-ext-json",
    historyTimestamp: Math.floor(Date.now() / 1000) - 5 * 60, // 5 minutes ago
    logLevel: "debug",
  });
  cable.on("connect", () => {
    $cableState.set("connected");
  });
  cable.on("disconnect", () => {
    $cableState.set("disconnected");
  });
  cable.on("close", () => {
    $cableState.set("closed");
  });

  $cable.set(cable);
});
