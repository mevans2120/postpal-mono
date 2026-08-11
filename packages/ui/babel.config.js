// Mirrors apps/app/babel.config.js so jest-expo/babel-jest applies
// NativeWind's JSX transform when testing this package directly.
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
  };
};
