const withMDX = require("@next/mdx")();

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  images: {
    domains: ["www.youtube.com", "img.youtube.com"],
  },
};

module.exports = withMDX(nextConfig);
