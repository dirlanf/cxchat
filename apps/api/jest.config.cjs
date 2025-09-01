/** @type {import('jest').Config} */
module.exports = {
  rootDir: '.',
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/test/unit', '<rootDir>/src'],
  testMatch: ['**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  testPathIgnorePatterns: ['/node_modules/'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
};
