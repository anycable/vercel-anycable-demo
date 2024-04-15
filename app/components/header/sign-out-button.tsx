"use client";

import { useFormStatus } from "react-dom";

import { Button } from "../button";

export function SignOutButton({ action }: { action: () => void }) {
  return (
    <form action={action}>
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button size="sm" disabled={pending}>
      Sign out
    </Button>
  );
}
