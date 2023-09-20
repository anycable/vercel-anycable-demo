"use client";

import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { SVGProps } from "react";
import { Menu } from "../menu";
import { Avatar } from "../avatar";

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
        <div className="h-8 w-8 hover:opacity-80">
          <Avatar username={usernameOrEmail} />
        </div>
      </Menu.Trigger>
      <Menu.Body align="right">
        <Menu.ItemRoot disabled>
          <Menu.TextItem>{usernameOrEmail}</Menu.TextItem>
        </Menu.ItemRoot>
        <Menu.ItemRoot disabled>
          <form action={signOutAction}>
            <SignOutButton />
          </form>
        </Menu.ItemRoot>
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

function HeroiconsUserCircle20Solid(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M18 10a8 8 0 1 1-16 0a8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}
