"use client";

import { ReactNode, useEffect } from "react";

export function InitializeFakeData(): ReactNode {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      import("./fakes");
    }
  }, []);

  return null;
}
