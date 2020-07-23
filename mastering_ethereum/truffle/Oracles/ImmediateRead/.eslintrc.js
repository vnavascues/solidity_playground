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
    artifacts: true,
    module: true,
    process: true,
    web3: true,
  },
  rules: {},
  extends: ["eslint:recommended", "prettier"],
};
