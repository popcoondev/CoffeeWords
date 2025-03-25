// dotenvの読み込み
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// .env.testファイルの読み込み
const envPath = path.resolve(__dirname, '.env.test');
if (fs.existsSync(envPath)) {
  console.log('Loading environment variables from .env.test for Jest config');
  dotenv.config({ path: envPath });
}

module.exports = {
  preset: 'jest-expo',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
      },
    ],
  },
  moduleNameMapper: {
    // Expo-secureStoreをモックに置き換えるための設定
    'expo-secure-store': '<rootDir>/src/__mocks__/expo-secure-store.ts',
    // react-native-dotenvをモックに置き換えるための設定
    '@env': '<rootDir>/src/__mocks__/env.ts'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|native-base|@sentry/.*)'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/android/',
    '<rootDir>/ios/'
  ],
  setupFiles: ['<rootDir>/jest.setup.js'],
  testEnvironment: process.env.TEST_ENV === 'jsdom' ? 'jsdom' : 'node',
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/src/__mocks__/'
  ],
  // テスト実行時に環境変数を設定
  testEnvironmentOptions: {
    env: {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      ENABLE_API_TESTS: process.env.ENABLE_API_TESTS
    }
  }
};