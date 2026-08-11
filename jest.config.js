module.exports = {
  projects: [
    '<rootDir>/packages/content/jest.config.js',
    '<rootDir>/packages/ui/jest.config.js',
    '<rootDir>/packages/ui/jest.expo.config.js'
    // apps/web (Next.js/DOM) is retired during the Expo/RNW port: it renders the
    // now-RN @postpal/ui with no react-native-web pipeline, so its jsdom test can
    // no longer load. Quarantined here; deleted entirely in Task 9. Recoverable
    // from main/history. See docs/plans/2026-08-11-expo-rnw-port.md.
  ]
};
