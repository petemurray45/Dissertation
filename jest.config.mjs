/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",

  coverageReporters: ["text", "lcov", "html"],

  testEnvironment: "node",
  roots: ["<rootDir>/tests"],

  transform: {},

  testMatch: ["**/?(*.)+(spec|test).js"],

  testPathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/tests/e2e/",
    "<rootDir>/tests/integration/",
  ],
};

export default config;
