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
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors. Only warnings in archive folder.
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: "/work",
        destination: "/",
        permanent: true,
      },
    ];
  },
  compiler: {
    styledComponents: true,
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

  // ADDED the below to try and fix deserialization performance;
  // https://stackoverflow.com/questions/78471919/how-to-debug-webpack-cache-packfilecachestrategy-serializing-big-strings-in
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
  },

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
