import '@testing-library/jest-dom';

// jsdom 26 does not implement structuredClone; provide it for the jsdom test
// environment. Production (Node/Next.js) has it natively.
if (typeof globalThis.structuredClone !== 'function') {
  globalThis.structuredClone = (value) => JSON.parse(JSON.stringify(value));
}
