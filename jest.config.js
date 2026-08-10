module.exports = {
  // Jest 30 only honors passWithNoTests at the root, not per-project.
  // Here until the ui package gains its first test (Task 7 removes it).
  passWithNoTests: true,
  projects: [
    '<rootDir>/packages/content/jest.config.js',
    '<rootDir>/packages/ui/jest.config.js'
  ]
};
