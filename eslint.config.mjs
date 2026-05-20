import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import { defineConfig, globalIgnores } from "eslint/config";
import reactRefreshPlugin from "eslint-plugin-react-refresh";
import perfectionistPlugin from "eslint-plugin-perfectionist";
import unusedImportsPlugin from "eslint-plugin-unused-imports";
import prettierRecommended from "eslint-plugin-prettier/recommended";

export default defineConfig([
  globalIgnores([
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**",
    "**/coverage/**",
    "**/.vite/**",
    "**/*.tsbuildinfo",
  ]),

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ["apps/api/src/**/*.ts"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  {
    files: ["apps/web/src/**/*.{ts,tsx}", "apps/web/vite.config.ts"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      "react-hooks": reactHooksPlugin,
      "react-refresh": reactRefreshPlugin,
    },
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
        },
      ],
    },
  },

  {
    plugins: {
      perfectionist: perfectionistPlugin,
      "unused-imports": unusedImportsPlugin,
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        {
          prefer: "type-imports",
          fixStyle: "separate-type-imports",
        },
      ],

      "@typescript-eslint/no-unused-vars": "off",

      "unused-imports/no-unused-imports": "warn",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],

      "perfectionist/sort-named-imports": [
        "warn",
        {
          order: "asc",
          type: "line-length",
        },
      ],

      "perfectionist/sort-named-exports": [
        "warn",
        {
          order: "asc",
          type: "line-length",
        },
      ],

      "perfectionist/sort-exports": [
        "warn",
        {
          order: "asc",
          type: "line-length",
        },
      ],

      "perfectionist/sort-imports": [
        "warn",
        {
          groups: [
            "style",
            "side-effect",
            "type",
            ["builtin", "external"],
            "internal",
            ["parent", "sibling", "index"],
            ["type-parent", "type-sibling", "type-index"],
            "unknown",
          ],
          ignoreCase: true,
          newlinesBetween: 1,
          order: "asc",
          type: "line-length",
        },
      ],
    },
  },

  prettierRecommended,
]);
