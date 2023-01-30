module.exports = {
  testTimeout: 60000,
  testEnvironment: "node",
  modulePathIgnorePatterns: ["./lib/"],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  preset: "ts-jest",
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{ts,js}"],
  coveragePathIgnorePatterns: ["/node_modules/", "/.github/", "/configs/"],
  restoreMocks: true,
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "./configs/tsconfig.esm.json",
      },
    ],
  },
};
