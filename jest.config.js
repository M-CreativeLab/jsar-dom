/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!node_modules/**',
  ],
  coverageReporters: [
    'html',
    'text-summary',
    'cobertura',
  ]
};
