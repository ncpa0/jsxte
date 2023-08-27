/**
 * @type {import("jest").Config}
 */
module.exports = {
  preset: "ts-jest",
  testRegex: ".*__tests__/.+(.test.(ts|js|tsx|jsx))$",
  transform: {
    "^.+.(ts|tsx)$": "ts-jest",
  },
  testEnvironment: "node",
  collectCoverageFrom: ["src/**/*.(ts|js|tsx|jsx)"],
  coverageReporters: ["html", "text"],
  roots: ["<rootDir>"],
  modulePaths: ["<rootDir>"],
  moduleNameMapper: {
    "^@jsx/(.*)$": "<rootDir>/src/jsx/$1",
  },
  snapshotFormat: {
    printBasicPrototype: true,
    escapeString: true,
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
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.test.json",
      autoMapModuleNames: true,
    },
  },
};
