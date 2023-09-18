"use client";

import { experimental_useFormStatus as useFormStatus } from "react-dom";

import { CombinedInput } from "./combined-input";

export function AuthForm({ action }: { action: (form: FormData) => unknown }) {
  return (
    <form action={action}>
      <CombinedInput.Root label="Your username">
        <CombinedInput.Input
          name="username"
          required
          placeholder="jack.sparrow"
        />
        <SubmitButton />
      </CombinedInput.Root>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return <CombinedInput.Button disabled={pending}>Enter</CombinedInput.Button>;
}
