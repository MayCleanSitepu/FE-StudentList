import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      sourceType: "module",
      parser: "babel-eslint",
      parserOptions: {
        allowImportExportEverywhere: true
      }
    }
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      parser: "babel-eslint",
      parserOptions: {
        allowImportExportEverywhere: true
      }
    }
  },
  {
    languageOptions: {
      globals: globals.browser
    }
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
];