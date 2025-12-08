import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    rules: {
      "no-unused-vars": ["error", { varsIgnorePattern: "^_" }],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { varsIgnorePattern: "^_" },
      ],
      "no-undef": "error",
      "no-undef-init": "error",
      "no-extra-boolean-cast": "error",
      "no-extra-semi": "error",
      "no-extra-parens": "error",
      "no-extra-label": "error",
      "no-console": "error",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  {
    ignores: [
      "node_modules",
      "dist",
      "build",
      "src/generated",
      "src/utils/logger.ts",
    ],
  }
);
