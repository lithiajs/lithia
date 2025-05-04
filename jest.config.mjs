/** @type {import('jest').Config} */
const config = {
  moduleFileExtensions: ['ts', 'tsx', 'js', 'mjs', 'json'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '\\.(spec|test)\\.ts$',
  transform: {
    '^.+\\.ts$': ['ts-jest', { useESM: true }],
  },
  moduleNameMapper: {
    '^lithia/core$': '<rootDir>/src/core',
    '^lithia/meta$': '<rootDir>/src/meta',
    '^lithia/types$': '<rootDir>/src/types',
    '^lithia/(.*)$': '<rootDir>/src/$1',
  },
  silent: false,
  coveragePathIgnorePatterns: ['/node_modules/', '/types/'],
  detectOpenHandles: true,
  extensionsToTreatAsEsm: ['.ts'],
};

export default config;
