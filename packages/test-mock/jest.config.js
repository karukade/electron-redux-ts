module.exports = {
  automock: true,
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.+(ts|js)'],
  transform: { '^.+\\.ts$': 'ts-jest' },
  unmockedModulePathPatterns: ['ts-jest/utils'],
};
