/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testRegex: ".*__tests__/.+(\.test\.(ts|js|tsx|jsx))$",
  transform: {
    "^.+\.(ts|tsx)$": "ts-jest",
  },
  testEnvironment: "jsdom",
  roots: ["<rootDir>"],
  collectCoverageFrom: ["src/**/*.(ts|js|tsx|jsx)"],
  coverageReporters: ["html", "text"],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/coverage/",
    "/__mocks__/",
    "/__tests__/",
    "/dist/",
    "/.husky/",
    "/.vscode/",
  ],
};
