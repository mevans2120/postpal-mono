# Cross-Platform Architecture: Capacitor vs. Expo/React Native Web

**Date:** 2026-08-11
**Status:** DECIDED — **Expo + React Native Web.** The research recommended Capacitor on fidelity/cost grounds, but the team weighting is mobile-first: the native mobile app is the most important surface and must not be a WebView, while still running on web + Android from one codebase. RNW delivers that. The findings below are retained as the rationale of record; the visual layer will be rebuilt in RN primitives while `@postpal/content`, the store, and `deriveDayView` carry over unchanged.
**Question:** How do we run **one shared UI** on web + iOS + Android for PostPal, given we already have a pixel-tuned Next.js + React DOM + Tailwind v4 + Zustand web app?

**Method:** Multi-source web research (19 sources) with adversarial verification (75 verification votes; a claim needed 2 of 3 independent refutations to be dropped). The verification pass removed several claims that would have skewed the decision — see *Claims the verification killed* at the end. Everything below is drawn only from claims that survived.

---

## Bottom line

**Recommendation: Capacitor (WebView shell) for PostPal now**, treating Apple's Guideline 4.2 execution checklist as non-negotiable — with Expo/React Native Web (RNW) as the right call only if native feel, ecosystem longevity, or med-reminder robustness outweigh design-fidelity preservation.

The real fork is **not** "one codebase vs. two." Both paths are single-codebase across all three platforms. It's:

- **Capacitor** — the *same web UI* runs in a native WebView on mobile. ~100% reuse of what we built. Fast, cheap, preserves the pixel-tuned design exactly. Main risk: App Store review.
- **Expo + RNW** — *one React Native codebase* renders native widgets on mobile and DOM on web. Logic/content carry over; the **visual layer is rewritten**. Better native feel and ecosystem; harder to match the existing design exactly.

Given the two stated priorities — **maximum code reuse** and **preserving the design fidelity we built** — Capacitor is the better fit for this specific app.

> **Correction to an earlier claim:** RNW + Expo runs one codebase on web + iOS + Android (it powers X/Twitter's web client). It is *not* "web as a separate app." The earlier framing that the RN path abandons web sharing was wrong, and the research explicitly refuted the vendor claim behind it.

---

## What carries over regardless of the choice

*(High confidence — Expo's own migration guidance.)* Non-visual logic ports unchanged to either path:

- `@postpal/content` — the Zod schema + all clinical copy
- The Zustand store (`store.ts`)
- `deriveDayView` (`derive.ts`) — pure dose-logging logic

What does **not** port to React Native is the DOM/CSS visual layer: no `<div>`/`<span>`, no CSS selectors or media queries in `StyleSheet`, and no **`position: fixed`** — which our fixed NextBar, day switcher, and sheet overlay all depend on. Capacitor keeps all of it verbatim; RNW requires re-solving these with flex + absolute positioning.

**Implication:** the earlier build is not wasted under either path. The RN path's rewrite is a *translation* of design decisions already made, not a redesign.

---

## The two paths across nine dimensions

| Dimension | Capacitor (WebView shell) | Expo + RNW (native + web) |
|---|---|---|
| **Code reuse / cost** | ~100% of the existing web UI; cheapest path (wrapping ≈ $40–80K-class vs. $80–150K for RN greenfield) | Logic/state/content reused; **visual layer rewritten** — a translation, not a redesign |
| **Native feel (content app)** | Perf gap vs. native is **negligible for content/form apps**; RN's edge is concentrated in graphics/gesture-heavy apps. CSS animations are GPU-composited and perform ~identically to native | Genuinely native widgets, scrolling, gestures at 60fps — strongest exactly where we're least demanding |
| **Startup / memory** | Boots a WebView; slightly higher baseline | Boots into native; faster cold start, lower memory |
| **App Store 4.2 risk** | **The biggest risk** — real and repeatable; manageable with the right execution (see below) | Native rendering sidesteps this rejection category |
| **Push / offline / meds** | Local Notifications plugin: scheduled + repeating reminders at the OS level (fires even if app is closed). **Caveat:** a backgrounded iOS WebView can be killed under memory pressure and drop the JS tap-handler on reload (2023 bug, closed "won't fix") | Expo local notifications: per-item IDs, snooze, background tasks, 100% offline via AsyncStorage — more robust for a medication-reminder use case |
| **Typographic fidelity** | Preserves the exact pixel-tuned design — it *is* the web UI | **Harder to match exactly:** NativeWind needs per-platform font setup (via expo-font), no CSS fallback font stacks (only the first font in an array is used), plus flex-basis / `position:fixed` / hover seams |
| **Accessibility** | Inherits existing web a11y work | Native a11y APIs; `@gorhom/bottom-sheet` provides accessible native sheets out of the box |
| **Maintenance / team** | Any web developer maintains it; lowest staffing cost | Needs RN familiarity (~2–4 wks ramp for React devs); more native moving parts (Reanimated, Gesture Handler) |
| **Momentum (2026)** | Mature and production-ready, but smaller: ~200K weekly npm for `@capacitor/core` | Much larger: ~2M weekly `react-native`, ~1.5M `expo`; RNW production-grade on Expo SDK 54/56 |

---

## The decisive factor: Apple App Store Guideline 4.2 ("Minimum Functionality")

This is where the WebView path carries genuine, repeatable risk — and also where PostPal's specifics make it manageable.

**The risk is real (high confidence):**
- A documented 2025 case: a WebView app rejected **10 times** under 4.2. Even after converting to a hybrid (native shell with only 2–3 WebView screens), Apple still rejected it for a menu that "didn't have enough content." Apple's remedy was a one-on-one review consultation, not a code fix — i.e., these are design/experience judgments, not easily appealed.
- Merely repackaging a website, or **remote-loading** web content from a server, reliably fails review.

**But PostPal is on the passing side of the line (high confidence):**
- The distinguishing factor is a *genuine app-style design layer* vs. a repackaged website. Apps with real custom UI pass (the cited example is Ionic-styled apps); WebView-augmented apps from Amazon, Instagram, and Basecamp ship successfully.
- PostPal is a bespoke, custom-designed editorial experience with **no browser chrome** — not a wrapped marketing site. That is exactly the design-led differentiation Apple looks for.

**4.2 execution checklist (non-negotiable if we go Capacitor):**
- [ ] **Bundle web assets locally** in the app — do not remote-load the UI from a server.
- [ ] Add **native push / local notifications** (also the med-schedule feature).
- [ ] Ship a **native splash screen** and **custom offline/error handling** (no default browser error states).
- [ ] Use **native-feeling navigation**; avoid any Safari-like loading bars or browser chrome.

Do these and it's a defensible native app. Skip them and it's in the 10-rejections bucket.

---

## If we go Expo/RNW instead — the styling sub-question

The three serious universal styling systems are **NativeWind, Tamagui, Unistyles**. The choice is philosophy over performance (all compile to ~1–2ms overhead per render):

- **NativeWind** (~8.1k GitHub stars, live-checked) — keeps our Tailwind mental model; least-jarring given we already built in Tailwind. Web support is good in v4, though not its original strength.
- **Tamagui** (~14.1k stars, Vercel-backed) — the only one offering true universal *component* reuse; more powerful, steeper learning curve.
- **Unistyles** — a third viable contender.

The native bottom sheet (to replace our sheet system) has a mature answer: **`@gorhom/bottom-sheet`** works across iOS/Android/web (RNW-compatible), with accessibility and keyboard handling built in — but it pulls in Reanimated v3 + Gesture Handler v2 as native dependencies.

---

## When to choose RNW over Capacitor

Flip the recommendation if any of these outweigh fidelity-preservation:
- Native feel is a **product differentiator** you want to invest in.
- You foresee **heavy native-feature** work over time.
- **Hiring** into the larger RN ecosystem matters for longevity.
- The **med-reminder reliability** edge (no WebView-termination caveat) is critical to the product.

---

## A sequencing option (de-risks the decision)

Because the logic layer (`content` + store + `derive`) is portable either way:

1. **Ship Capacitor now** — fast, preserves the reviewed UI, gets to all three platforms + the App Store.
2. **Migrate the visual layer to RNW later** *if* native feel becomes a priority — reusing the already-portable content/store/logic.

You are not betting the product permanently on one framework.

---

## Claims the verification pass killed (excluded from the findings above)

Recorded for transparency — these did **not** survive adversarial checking:

- ❌ *"React Native cannot reuse web code and requires a separate web app."* Refuted — RNW + Expo is a mature one-codebase-all-three layer (X/Twitter, Flipkart, MLS).
- ❌ *"Next.js + Capacitor achieves 100% code sharing while Expo cannot easily share with web."* Refuted — traced to a Capacitor-starter vendor (nextnative.dev) with a direct conflict of interest; Expo runs on web via RNW.
- ❌ *"Capacitor feels very native."* Refuted — same vendor source; independent comparisons note WebView gesture/scroll can feel "slightly off" without deliberate effort.
- ❌ *"React Native requires rebuilding the app from scratch."* Refuted as overreach — RN migrations reuse state, business logic, API clients, and utilities.
- ❌ *Specific "must have native tab bar + splash + push to pass 4.2" as hard requirements.* Refuted as inflating one approved example into a rulebook; Apple's 4.2 text is qualitative.
- ❌ *Various Feb-2026 GitHub star counts.* Corrected against the live GitHub API (Aug 2026): Tamagui ~14.1k, NativeWind ~8.1k, twrnc ~2.4k.

## Source notes

Findings synthesized from 19 sources spanning Expo's official migration/web docs and FAQ, the Capacitor Local Notifications plugin docs, Apple developer-forum 4.2 rejection threads (2020, 2025), `@gorhom/bottom-sheet` docs, NativeWind font docs, multiple independent framework comparisons, and live GitHub API star counts. Vendor-marketing sources (e.g., Capacitor-starter storefronts) were down-weighted or excluded where they had a conflict of interest, which is why several "Capacitor is strictly superior" claims were dropped.
