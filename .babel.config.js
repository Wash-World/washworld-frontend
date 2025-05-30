//This file is a Babel configuration for an Expo-based React Native (or web) project.

module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
