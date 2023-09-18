"use client";

import { CombinedInput } from "./combined-input";

export function AuthForm() {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <CombinedInput.Root label="Your username">
        <CombinedInput.Input required placeholder="jack.sparrow" />
        <CombinedInput.Button>Enter</CombinedInput.Button>
      </CombinedInput.Root>
    </form>
  );
}
