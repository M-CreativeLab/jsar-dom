const presets = require('ts-jest/presets');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  transform: {
    ...presets.jsWithTsESM.transform,
  },
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!node_modules/**',
  ],
  setupFiles: [
    './jest.setup.cjs',
  ],
  coverageReporters: [
    'html',
    'text-summary',
    'cobertura',
  ],
  moduleNameMapper: {
    '@bindings/craft3d': '<rootDir>/bindings/craft3d',
    '@bindings/taffy': '<rootDir>/bindings/taffy',
    '@bindings/noise': '<rootDir>/bindings/noise',
  },
};
