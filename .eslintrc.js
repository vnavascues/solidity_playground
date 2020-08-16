module.exports = {
  env: {
    browser: true,
    es2020: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 11,
    sourceType: "module",
  },
  globals: {},
  rules: {},
  extends: ["eslint:recommended", "prettier"],
};
