import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "coverage-integration",
    },
    setupFiles: ["./tests/setup/vitest.setup.js"],
    // make files run one-by-one
    fileParallelism: false,
    sequence: { concurrent: false },
    // ensure single worker
    pool: "threads",
    poolOptions: { threads: { singleThread: true } },
  },
});
