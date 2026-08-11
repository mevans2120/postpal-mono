import '@testing-library/jest-dom';

// jsdom 26 does not implement structuredClone; provide it for the jsdom test
// environment (mirrors packages/ui/jest.setup.ts). Production (Node/Next.js)
// has it natively. The JSON round-trip is only equivalent to native
// structuredClone for JSON-plain data — which all @postpal/content data is.
if (typeof globalThis.structuredClone !== 'function') {
  globalThis.structuredClone = (value) => JSON.parse(JSON.stringify(value));
}
