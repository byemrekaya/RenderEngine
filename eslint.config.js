// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("@typescript-eslint/eslint-plugin");
const tseslintParser = require("@typescript-eslint/parser");
const angular = require("@angular-eslint/eslint-plugin");

module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@angular-eslint/recommended",
    "plugin:@angular-eslint/template/process-inline-templates",
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "no-console": "off",
  },
};
