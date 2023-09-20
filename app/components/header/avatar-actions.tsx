"use client";

import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { Menu } from "../menu";
import { Avatar } from "../avatar";
import { $cable, $cableState, CableState } from "@/app/stores/cable";
import { useStore } from "@nanostores/react";
import { cx } from "class-variance-authority";

export function AvatarActions({
  usernameOrEmail,
  signOutAction,
}: {
  usernameOrEmail: string;
  signOutAction: () => void;
}) {
  return (
    <Menu.Root>
      <Menu.Trigger label="My profile">
        <div className="relative h-8 w-8 hover:opacity-80">
          <div className="absolute left-0 top-0">
            <Indicator />
          </div>
          <Avatar username={usernameOrEmail} />
        </div>
      </Menu.Trigger>
      <Menu.Body align="right">
        <div className="divide-y divide-gray-100">
          <div className="pb-1">
            <Menu.ItemRoot>
              <DisconnectButton />
            </Menu.ItemRoot>

            <Menu.TextItem>
              <Status />
            </Menu.TextItem>
          </div>
          <Menu.TextItem>{usernameOrEmail}</Menu.TextItem>
          <div className="pt-1">
            <Menu.ItemRoot disabled>
              <form action={signOutAction}>
                <SignOutButton />
              </form>
            </Menu.ItemRoot>
          </div>
        </div>
      </Menu.Body>
    </Menu.Root>
  );
}

function SignOutButton() {
  const { pending } = useFormStatus();

  return (
    <Menu.InteractiveItem as="button" disabled={pending}>
      {pending ? "Signing out…" : "Sign out"}
    </Menu.InteractiveItem>
  );
}

function Status() {
  const state = useStore($cableState);

  return (
    <div className="flex items-center gap-2">
      <Indicator />
      <div className="text-xs text-gray-500">{state}</div>
    </div>
  );
}

const bgClass: Record<CableState, string> = {
  idle: "bg-green-400",
  disconnected: "bg-red-400",
  connecting: "bg-blue-400",
  connected: "bg-green-400",
  closed: "bg-gray-400",
};
function Indicator() {
  const state = useStore($cableState);

  return (
    <div
      className={cx("h-1 w-1 rounded-full transition-colors", bgClass[state])}
    />
  );
}

function DisconnectButton() {
  const state = useStore($cableState);
  const cable = useStore($cable);

  // We can't do anything here
  if (state === "disconnected") return null;

  const onClick =
    state === "closed" ? () => cable?.connect() : () => cable?.disconnect();

  return (
    <Menu.InteractiveItem as="button" onClick={onClick}>
      {state === "closed" ? "Connect" : "Disconnect"}
    </Menu.InteractiveItem>
  );
}
