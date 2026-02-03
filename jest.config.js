module.exports = {
  preset: 'ts-jest',
  testMatch: ['<rootDir>/tests/**/*.test.ts', '<rootDir>/tests/**/*.test.tsx'],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.ts',
    '!src/app.tsx',
    '!src/Application.tsx',
    '!src/contextBridge.ts',
    '!src/store.ts',
    '!src/renderer.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 48,  // Slightly lower than other metrics as branch coverage is harder to achieve
      functions: 70,
      lines: 70,
      statements: 70
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