module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/**/*.test.js'],
  transformIgnorePatterns: ['\\.scss'],
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.(css|less|scss)$$': 'jest-transform-stub',
  },
  moduleFileExtensions: ['js', 'json', 'jsx'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  // collectCoverage: true,
  // coverageReporters: ['lcov', 'text', 'text-summary'],
  // collectCoverageFrom: ['src/**/*.{js,jsx}', '!src/index.js', '!**/node_modules/**'],
};
