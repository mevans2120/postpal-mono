// The RN component project — renders real React Native trees via
// react-test-renderer (through @testing-library/react-native), driven by the
// jest-expo preset so Metro-only syntax (Flow, native requires) transforms
// the same way it does inside the Expo app. This package's own
// babel.config.js applies the NativeWind JSX transform on top.
module.exports = {
  preset: 'jest-expo',
  displayName: 'ui-rn',
  testMatch: ['<rootDir>/src/**/*.rn.test.tsx']
};
