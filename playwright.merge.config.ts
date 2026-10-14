import { defineConfig } from '@playwright/test';

export default defineConfig({
    // Force a consistent rootDir when merging shard blob reports from different runners.
    testDir: './src/tests',
});