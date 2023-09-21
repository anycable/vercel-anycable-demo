"use client";

import { Menu } from "../menu";

async function copyToClipboard() {
  await navigator.clipboard.writeText(window.location.href);
}

export function RoomActions({ newRoomId }: { newRoomId: string }) {
  return (
    <Menu.Root>
      <Menu.Trigger />
      <Menu.Body align="left">
        <Menu.ItemRoot>
          <Menu.InteractiveItem as="button" onClick={copyToClipboard}>
            Copy URL
          </Menu.InteractiveItem>
        </Menu.ItemRoot>
        <Menu.ItemRoot>
          <Menu.InteractiveItem as="a" href={`/?roomId=${newRoomId}`}>
            New room
          </Menu.InteractiveItem>
        </Menu.ItemRoot>
      </Menu.Body>
    </Menu.Root>
  );
}
