module.exports = {
  preset: 'ts-jest',
  testMatch: ['<rootDir>/tests/**/*.test.ts', '<rootDir>/tests/**/*.test.tsx'],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
  coverageThreshold: {
    global: {
      branches: 20,
      functions: 20,
      lines: 20,
      statements: 20
    }
  },
  moduleNameMapper: {
    '^electron$': '<rootDir>/tests/__mocks__/electron.ts',
    '^uuid$': require.resolve('uuid')
  },
  transformIgnorePatterns: [
    'node_modules/(?!(uuid)/)'
  ],
  maxWorkers: 2,
  workerIdleMemoryLimit: '512MB'
};