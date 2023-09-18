"use client";

import { map, onStart } from "nanostores";

const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
};

export const $user = map({
  username: "",
});
onStart($user, () => {
  const username = getCookie("username");
  if (!username) throw new Error("Incorrect state: no username provided");

  $user.set({ username });
});
