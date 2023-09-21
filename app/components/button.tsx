import { VariantProps, cva, cx } from "class-variance-authority";

const button = cva(
  "relative cursor-pointer rounded-md disabled:cursor-not-allowed",
  {
    variants: {
      theme: {
        red: "text-white bg-red-500 enabled:hover:bg-red-400 disabled:bg-red-300",
        ghost: "text-gray-950 font-semibold enabled:hover:text-gray-800",
      },
      size: {
        sm: "px-2 py-1 rounded text-xs",
        md: "px-5 py-2 rounded-md",
      },
    },
    defaultVariants: { theme: "red", size: "md" },
  },
);

export function Button({
  theme,
  size,
  className,
  ...props
}: JSX.IntrinsicElements["button"] & VariantProps<typeof button>) {
  return (
    <button {...props} className={cx(className, button({ theme, size }))} />
  );
}
