module.exports = {
  preset: 'jest-expo',
  setupFiles: ['./jest.setup.js'],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],

  // By default Jest ignores everything in node_modules.
  // We “negative match” here to force these modules through Babel.
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native' +
      '|@react-native' +
      '|@react-navigation' +
      '|@testing-library' +
      '|expo' +
      '|expo-modules-core' +
      '|expo-font' +
      '|expo-constants' +
      '|expo-asset' +
      '|expo-file-system' +
      // Add these two so their ES imports get compiled, too:
      '|react-redux' +
      '|redux-mock-store' +
      ')',
  ],

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
