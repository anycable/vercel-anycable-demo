import { getGravatarUrl } from "@/utils/gravatar-url";
import TeenyiconsRobotOutline from "~icons/teenyicons/robot-outline";
import TeenyiconsUserCircleOutline from "~icons/teenyicons/user-circle-outline";
import { cx } from "class-variance-authority";
import { useMemo } from "react";

export function Avatar({
  username,
  indicatorClass,
  fallbackType = "human",
}: {
  username: string;
  indicatorClass?: string;
  fallbackType?: "human" | "robot";
}) {
  const url = useMemo(() => {
    return getGravatarUrl(username);
  }, [username]);

  const FallbackIcon =
    fallbackType === "robot"
      ? TeenyiconsRobotOutline
      : TeenyiconsUserCircleOutline;

  const fragment = url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="rounded-full" src={url} alt="" />
  ) : (
    <FallbackIcon className="h-full w-full text-zinc-500" aria-hidden />
  );

  return (
    <div className="relative select-none">
      <div>{fragment}</div>
      {indicatorClass && (
        <span
          className={cx(
            "absolute right-0 top-0 block h-2 w-2 rounded-full ring-2 ring-white transition-colors",
            indicatorClass,
          )}
        />
      )}
    </div>
  );
}
