// The RN component project — renders real React Native trees via
// react-test-renderer (through @testing-library/react-native), driven by the
// jest-expo preset so Metro-only syntax (Flow, native requires) transforms
// the same way it does inside the Expo app. This package's own
// babel.config.js applies the NativeWind JSX transform on top.
module.exports = {
  preset: 'jest-expo',
  displayName: 'ui-rn',
  testMatch: ['<rootDir>/src/**/*.rn.test.tsx'],
  // react-native-worklets (react-native-reanimated 4's native runtime dep) ships
  // this resolver so Jest's extensionless `require`s land on its plain (JS,
  // test-safe) modules instead of the `.native.ts` ones that reach for a real
  // native binding — without it, merely importing react-native-reanimated
  // throws ("Cannot read properties of undefined (reading 'loadUnpackers')").
  resolver: 'react-native-worklets/jest/resolver'
};
