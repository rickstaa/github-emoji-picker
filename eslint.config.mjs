import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";
import tsParser from "@typescript-eslint/parser";

const eslintConfig = [
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat["jsx-runtime"],
  nextPlugin.configs["core-web-vitals"],
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: { "react-hooks": hooksPlugin },
    languageOptions: {
      parser: tsParser,
      parserOptions: { sourceType: "module" },
    },
    settings: { react: { version: "detect" } },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@next/next/no-img-element": "off",
    },
  },
];

export default eslintConfig;
