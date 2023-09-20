import { SVGProps, useMemo } from "react";
import { getGravatarUrl } from "../utils/gravatar-url";

export function Avatar({ username }: { username: string }) {
  const url = useMemo(() => {
    return getGravatarUrl(username);
  }, [username]);

  if (url)
    // eslint-disable-next-line @next/next/no-img-element
    return <img className="h-full w-full rounded-full" src={url} alt="" />;

  return <HeroiconsUserCircle20Solid className="text-gray-500" aria-hidden />;
}

function HeroiconsUserCircle20Solid(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M18 10a8 8 0 1 1-16 0a8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}
