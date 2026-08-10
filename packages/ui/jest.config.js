const swcTransform = ['@swc/jest', {
  jsc: { parser: { syntax: 'typescript', tsx: true }, transform: { react: { runtime: 'automatic' } } }
}];
module.exports = {
  displayName: 'ui',
  testEnvironment: 'jsdom',
  transform: { '^.+\\.(t|j)sx?$': swcTransform },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts']
};
