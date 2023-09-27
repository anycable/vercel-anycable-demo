import { PropsWithChildren } from "react";
import { PoweredBy } from "./powered-by";

export function MainLayout(props: PropsWithChildren) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-2xl content-center">
        {props.children}
      </div>
      <PoweredBy />
    </div>
  );
}
