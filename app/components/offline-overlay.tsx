import { useStore } from "@nanostores/react";
import { cx } from "class-variance-authority";
import { $cableState } from "../stores/cable";

export function OfflineOverlay() {
  const cableState = useStore($cableState);

  return (
    <div
      className={cx(
        "pointer-events-none fixed inset-0 z-20 opacity-0 backdrop-grayscale transition-opacity duration-700",
        cableState === "closed" && "opacity-100",
      )}
    />
  );
}
