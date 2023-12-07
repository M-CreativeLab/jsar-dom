/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest/presets/js-with-ts-esm',
  testEnvironment: 'node',
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
    '@bindings/taffy': '<rootDir>/bindings/taffy',
  },
};
