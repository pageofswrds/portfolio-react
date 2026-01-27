import nextConfig from "eslint-config-next";
import eslintConfigPrettier from "eslint-config-prettier";

const eslintConfig = [
  ...nextConfig,
  eslintConfigPrettier,
  {
    ignores: ["node_modules/", ".next/", "out/"],
  },
];

export default eslintConfig;
