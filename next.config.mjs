import Icons from "unplugin-icons/webpack";

/** @type {import('next').NextConfig} */
const config = {
  rewrites: async () => {
    return [
      {
        source: "/api/anycable/:path*",
        destination: "/api/anycable",
      },
    ];
  },
  webpack(config) {
    config.plugins.push(
      Icons({
        compiler: "jsx",
        jsx: "react",
      }),
    );

    return config;
  },
};

export default config;
