"use client";

import { map } from "nanostores";

// TEMP: pick a random name from the list of pirates
const names = ["jack sparrow", "davy jones", "blackbeard", "anne bonny"];
const randomName = names[Math.floor(Math.random() * names.length)];

export const $user = map({
  name: randomName,
});
