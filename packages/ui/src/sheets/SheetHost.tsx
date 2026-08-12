import { useEffect, useRef } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import type { ProcedureContent } from '@postpal/content';
import { useDaybook } from '../store';
import { SheetBody, SHEET_LABELS } from './SheetBody';
import { colors } from '../../tokens';

export interface SheetHostProps {
  content: ProcedureContent;
}

// backgroundStyle/handleIndicatorStyle are plain RN style objects, not NativeWind
// classNames (@gorhom/bottom-sheet exposes no className prop on these), so the
// sheet's paper background and line-colored grab handle read from tokens.js.

/**
 * The sheet host: ONE BottomSheetModal (from @gorhom/bottom-sheet), driven by
 * store.sheet, hosting whichever body SheetBody dispatches to. This replaces
 * the DOM's hand-rolled overlay + focus management + CSS slide outright — the
 * library supplies the slide animation (Reanimated), the grab handle, the
 * backdrop, and accessibility/keyboard handling (reduced-motion is honored
 * automatically via Reanimated's `ReduceMotion.System` default) — so none of
 * the DOM's focus-trap / exit-timer / Escape-key / rAF machinery is ported.
 *
 * `enableDynamicSizing` sizes the sheet to its content (the DOM's content-
 * height cap was `max-h-[82dvh]`); `maxDynamicContentSize` reproduces that cap
 * at ~82% of the window height so the tall med rail scrolls instead of
 * overflowing the screen.
 */
export function SheetHost({ content }: SheetHostProps) {
  const sheet = useDaybook((s) => s.sheet);
  const closeSheet = useDaybook((s) => s.closeSheet);
  const modalRef = useRef<BottomSheetModal>(null);
  // Tracks whether the modal is CURRENTLY presented, not which sheet it's
  // showing. A content swap (feel -> interpreter, or "Not quite" escalating
  // in place) changes store.sheet's kind/payload while `sheet` itself stays
  // non-null the whole time — that must update the body in place, not
  // re-present (which would replay the slide-in animation from scratch).
  const wasOpen = useRef(false);
  const { height: windowHeight } = useWindowDimensions();

  useEffect(() => {
    const isOpen = sheet !== null;
    if (isOpen && !wasOpen.current) {
      modalRef.current?.present();
    } else if (!isOpen && wasOpen.current) {
      modalRef.current?.dismiss();
    }
    wasOpen.current = isOpen;
  }, [sheet]);

  const renderBackdrop = (props: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />
  );

  return (
    <BottomSheetModal
      ref={modalRef}
      onDismiss={closeSheet}
      enableDynamicSizing
      enablePanDownToClose
      maxDynamicContentSize={windowHeight * 0.82}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.paper, borderTopLeftRadius: 26, borderTopRightRadius: 26 }}
      handleIndicatorStyle={{ backgroundColor: colors.line, width: 40, height: 4 }}
      accessibilityLabel={sheet ? SHEET_LABELS[sheet.kind] : undefined}
    >
      <BottomSheetScrollView>
        <View className="px-6 pt-2 pb-8">
          <SheetBody content={content} />
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}
