// The node logic project — store.ts/derive.ts are DOM-free pure logic, so
// they run under plain node (no jsdom, no RN renderer needed). Node 20 has
// native structuredClone, so no polyfill/setup file is needed here.
// Component tests (RN rendering) live in the sibling jest.expo.config.js
// project instead — see jest.expo.config.js and the root jest.config.js.
const swcTransform = ['@swc/jest', {
  jsc: { parser: { syntax: 'typescript', tsx: true }, transform: { react: { runtime: 'automatic' } } }
}];
module.exports = {
  displayName: 'ui',
  testEnvironment: 'node',
  transform: { '^.+\\.(t|j)sx?$': swcTransform },
  testMatch: ['<rootDir>/src/store.test.ts', '<rootDir>/src/derive.test.ts']
};
