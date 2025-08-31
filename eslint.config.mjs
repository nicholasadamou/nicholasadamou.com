import { fixupConfigRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";
import js from "@eslint/js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const config = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "tools/**/*",
    ],
  },
  ...fixupConfigRules([
    ...compat.extends("next/core-web-vitals", "prettier"),
    ...compat.plugins("prettier"),
  ]),
  {
    rules: {
      "prettier/prettier": "error",
    },
  },
];

export default config;
