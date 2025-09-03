/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",

  testEnvironment: "node",

  // Tell Jest where tests live (adjust if needed)
  roots: ["<rootDir>/tests"],

  // No transforms needed for plain JS
  transform: {},

  // (Optional) be explicit about matches
  testMatch: ["**/?(*.)+(spec|test).js"],

  testPathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/tests/e2e/", // <-- add this line
  ],
};

export default config;
