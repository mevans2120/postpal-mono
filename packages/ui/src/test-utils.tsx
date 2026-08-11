import type { ReactElement } from 'react';
import { act, render } from '@testing-library/react-native';
import { createDaybookStore, DaybookStoreContext } from './store';
import type { DaybookState, DaybookStore } from './store';

/**
 * Renders `ui` inside a fresh DaybookStoreContext for `day` and returns the
 * store, so a test can both drive it (store.getState().selectFace(...)) and
 * assert against the resulting render tree. Shared by Tasks 3–7.
 *
 * RNTL sets IS_REACT_ACT_ENVIRONMENT, so an external store mutation made
 * outside a React event is deferred until the next act() flush — a bare
 * `store.getState().selectFace(i)` would not reach the render tree before the
 * following assertion. The returned store therefore proxies getState() so
 * that invoking an action (any function-valued state field) runs inside
 * act(), flushing the subscribed re-render synchronously. Data fields (face,
 * phase, note, sheet…) pass through unchanged, so
 * `expect(store.getState()).toMatchObject(...)` still reads plain values.
 */
export function renderWithStore(day: number, ui: ReactElement): DaybookStore {
  const store = createDaybookStore(day);
  render(<DaybookStoreContext.Provider value={store}>{ui}</DaybookStoreContext.Provider>);

  const getState = store.getState.bind(store);
  return new Proxy(store, {
    get(target, prop, receiver) {
      if (prop !== 'getState') return Reflect.get(target, prop, receiver);
      return () =>
        new Proxy(getState(), {
          get(state, key) {
            const value = Reflect.get(state, key);
            if (typeof value !== 'function') return value;
            return (...args: unknown[]) => {
              let result: unknown;
              act(() => {
                result = (value as (...a: unknown[]) => unknown)(...args);
              });
              return result;
            };
          }
        }) as DaybookState;
    }
  });
}
