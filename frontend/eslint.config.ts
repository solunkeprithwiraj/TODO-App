import tseslint from "typescript-eslint";
import eslintjs from "@eslint/js";
import nextConfig from "eslint-config-next";

export default tseslint.config([
    eslintjs.configs.recommended,
    ...tseslint.configs.recommended,
    ...nextConfig,

    

    {
        ignores: ["node_modules", "dist", ".next", "build"],
    }
]);