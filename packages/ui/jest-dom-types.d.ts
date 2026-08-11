// Ambient Jest DOM matcher types only (no runtime import). Preserves
// `tsc --noEmit` for the not-yet-ported DOM component tests
// (src/daybook/*.test.tsx, src/sheets/sheets.test.tsx), which use matchers
// like toBeInTheDocument()/toHaveFocus() — previously available because
// jest.setup.ts (deleted per Task 1's Jest reconfiguration) imported
// '@testing-library/jest-dom' for its side-effect of augmenting the global
// Jest Matchers interface. This file is NOT wired into either jest
// project's setupFilesAfterEnv, so it adds no jsdom runtime dependency —
// it only keeps typecheck green for files this task does not own.
/// <reference types="@testing-library/jest-dom" />
