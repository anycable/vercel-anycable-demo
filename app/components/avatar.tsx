import { SVGProps, useMemo } from "react";
import { getGravatarUrl } from "../utils/gravatar-url";
import { cx } from "class-variance-authority";

export function Avatar({
  username,
  indicatorClass,
}: {
  username: string;
  indicatorClass?: string;
}) {
  const url = useMemo(() => {
    return getGravatarUrl(username);
  }, [username]);

  const fragment = url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="rounded-full" src={url} alt="" />
  ) : (
    <TeenyiconsUserCircleSolid
      className="h-full w-full text-gray-500"
      aria-hidden
    />
  );

  return (
    <div className="relative">
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

export function TeenyiconsUserCircleSolid(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 15 15"
      {...props}
    >
      <path
        fill="currentColor"
        d="M5 5.5a2.5 2.5 0 1 1 5 0a2.5 2.5 0 0 1-5 0Z"
      ></path>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M7.5 0a7.5 7.5 0 1 0 0 15a7.5 7.5 0 0 0 0-15ZM1 7.5a6.5 6.5 0 1 1 10.988 4.702A3.5 3.5 0 0 0 8.5 9h-2a3.5 3.5 0 0 0-3.488 3.202A6.482 6.482 0 0 1 1 7.5Z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}
