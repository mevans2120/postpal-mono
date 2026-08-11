// Public API of @postpal/ui — a universal React Native component (works under
// react-native-web and native). Daybook is the main export; the store hook and
// its types are re-exported for consumers that need to read or drive state.
export { Daybook } from './daybook/Daybook';
export type { DaybookProps } from './daybook/Daybook';

export {
  createDaybookStore,
  DaybookStoreContext,
  useDaybook
} from './store';
export type {
  DaybookState,
  DaybookStore,
  Phase,
  OpenSheet,
  OpenSheetKind,
  SheetPayload
} from './store';
