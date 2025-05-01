export default {
  collectCoverage: true,
  collectCoverageFrom: ['./src/**.ts'],
  coverageReporters: ['text', 'html'],
  // coverageThreshold: {
  //   global: {
  //     branches: 74,
  //     functions: 98,
  //     lines: 93.4,
  //     statements: 93.4,
  //   },
  // },
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'],
  preset: 'ts-jest/presets/default-esm',
  resetMocks: true,
  restoreMocks: true,
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  extensionsToTreatAsEsm: ['.ts'],
  testEnvironment: 'node',
  testRegex: ['\\.test\\.(ts|js)$'],
  testTimeout: 30000,
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  setupFiles: ['<rootDir>/jest.setup.js'],
};
