import '@testing-library/jest-dom';

// jsdom 26 does not implement structuredClone; provide it for the jsdom test
// environment. Production (Node/Next.js) has it natively.
// This JSON round-trip is only equivalent to native structuredClone for
// JSON-plain data (no Date/Map/Set/undefined/functions/cycles) — which all
// @postpal/content data is. If content ever gains a non-JSON value, replace
// this with a real polyfill so tests don't diverge from production.
if (typeof globalThis.structuredClone !== 'function') {
  globalThis.structuredClone = (value) => JSON.parse(JSON.stringify(value));
}
