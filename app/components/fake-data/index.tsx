"use client";

import { ReactNode, useEffect } from "react";

export function InitializeFakeData(): ReactNode {
  useEffect(() => {
    if (process.env.NODE_ENV === "development" && false) {
      import("./fakes");
    }
  }, []);

  return null;
}
