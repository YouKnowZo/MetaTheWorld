const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$' : '<rootDir>/src/$1',
    '^.+\.(css|less|sass|scss)$' : 'identity-obj-proxy',
    '^.+\.(jpg|jpeg|png|gif|webp|avif|svg)$' : '<rootDir>/__mocks__/fileMock.js',
    'lucide-react': '<rootDir>/__mocks__/lucide-react.js',
    '@rainbow-me/rainbowkit': '<rootDir>/__mocks__/@rainbow-me/rainbowkit.js',
    'next/link': '<rootDir>/__mocks__/next/link.js',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(?:.pnpm/)?(@wagmi|wagmi|@web3modal|lucide-react|@rainbow-me)/)',
  ],
};

module.exports = createJestConfig(customJestConfig);
