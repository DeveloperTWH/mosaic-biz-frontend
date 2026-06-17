import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      "no-restricted-syntax": [
        "warn",
        {
          selector:
            "Literal[value=/^\\[#[0-9A-Fa-f]{3,8}\\]/], Literal[value=/^bg-\\[#/], Literal[value=/^text-\\[#/], Literal[value=/^border-\\[#/]",
          message:
            "Avoid hardcoded hex in Tailwind classes. Use brand tokens from tailwind.config.js (see docs/STYLE_GUIDE.md).",
        },
      ],
    },
  },
]);
