// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html
module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  // collectCoverageFrom: ["src/**/*.{js,jsx,mjs}"],

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // An array of file extensions your modules use
  moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node"],

  // Handling aliases. Below sources of aliases:
  //   - functions/package.json (via 'module-alias' dependency) -> _moduleAliases
  //      https://github.com/ilearnio/module-alias/issues/46
  // moduleNameMapper: {
  //   "^@admin(.*)$": "<rootDir>/functions/admin.js",
  //   "^@api(.*)$": "<rootDir>/functions/api/$1",
  //   "^@firebase_test(.*)$": "<rootDir>/functions/firebase_test.js",
  //   "^@root(.*)$": "<rootDir>/functions/$1",
  //   "^@triggers(.*)$": "<rootDir>/functions/triggers/$1",
  // },

  // Prettier
  preset: "<rootDir>/node_modules/jest-runner-prettier",
  prettierPath: "<rootDir>/node_modules/prettier",

  // jest-runner-groups
  runner: "groups",

  // The paths to modules that run some code to configure or set up the testing environment before each test
  //setupFiles: ["<rootDir>/.env.test.node.js"],

  // The test environment that will be used for testing
  testEnvironment: "node",

  // The glob patterns Jest uses to detect test files
  // testMatch: [
  //   "**/__tests__/**/+(spec|test).node.js?(x)",
  //   "**/?(*.)+(spec|test).node.js?(x)",
  // ],
  testMatch: [
    "**/__tests__/**/+(spec|test).js?(x)",
    "**/?(*.)+(spec|test).js?(x)",
  ],

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: ["\\\\node_modules\\\\"],

  // This option sets the URL for the jsdom environment. It is reflected in properties such as location.href
  // testURL: "http://localhost",

  // process `*.vue` files with `vue-jest`
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest",
    ".+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$":
      "jest-transform-stub",
  },

  //transformIgnorePatterns: ["./node_modules/"],
  // Indicates whether each individual test should be reported during the run
  verbose: false,

  // Filter tests by file name or test name
  watchPlugins: [
    "<rootDir>/node_modules/jest-watch-typeahead/filename",
    "<rootDir>/node_modules/jest-watch-typeahead/testname",
  ],
};
