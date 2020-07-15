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
  globals: {
    web3: true,
    artifacts: true,
    module: true,
  },
  rules: {},
  extends: ["eslint:recommended", "prettier"],
};
