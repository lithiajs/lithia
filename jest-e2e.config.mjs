/** @type {import('jest').Config} */
import base from './jest.config.mjs';

const config = {
  ...base,
  testRegex: '\\.e2e-(spec|test)\\.ts$',
  testTimeout: 30000,
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
};

export default config;
