import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontSize: {
        "2xs": "0.6rem", // You can adjust the size as needed
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".text-wrap": { "text-wrap": "wrap" },
        ".text-nowrap": { "text-wrap": "nowrap" },
        ".text-balance": { "text-wrap": "balance" },
      });
    }),
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".absolute-center": {
          "--tw-translate-x": "-50%",
          "--tw-translate-y": "-50%",
          left: "50%",
          position: "absolute",
          top: "50%",
          transform:
            "translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))",
        },
      });
    }),
  ],
};
export default config;
