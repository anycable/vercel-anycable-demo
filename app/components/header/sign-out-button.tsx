"use client";

import { Button } from "../button";
import { experimental_useFormStatus as useFormStatus } from "react-dom";

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
