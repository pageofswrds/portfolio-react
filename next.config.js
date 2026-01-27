const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  async redirects() {
    return [
      {
        source: "/work",
        destination: "/",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fggzsvq4oc9hlhbo.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "schultzdavidg-portfolio.s3.us-west-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  transpilePackages: [
    "three",
    "@react-three/fiber",
    "@react-three/drei",
    "@react-three/postprocessing",
  ],

  webpack: (config, { dev }) => {
    // Use memory cache to avoid "Serializing big strings" warnings
    // Memory cache handles large strings more efficiently than filesystem cache
    config.cache = {
      type: "memory",
      maxGenerations: dev ? 1 : 3, // More generations in production for better caching
    };

    return config;
  },
};

module.exports = withBundleAnalyzer(withMDX(nextConfig));
