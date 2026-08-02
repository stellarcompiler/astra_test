# Debug Strategy — Current Codebase

## Baseline

The current source was re-audited after the viewport, starfield, and ripple changes. The implementation is buildable:

- `npm run type-check` — passes
- `npm run lint` — passes with zero warnings
- `npm run build` — passes
- Production output: JavaScript 146.17 kB (47.53 kB gzip), CSS 8.26 kB (2.62 kB gzip), moon SVG 453.29 kB (175.15 kB gzip)

The earlier short-viewport overflow, distorted composition ratio, stale heading exclusion, abrupt 768 px star-count jump, reversed ripple direction, and missing root guard are resolved in the current source. Decorative graphics remain inaccessible to assistive technology and reduced-motion users receive a static starfield.

## Prioritized findings

### P0 — Repair the moon asset rather than masking its background

**Evidence**

- `src/assets/hero/moon.svg:1` still includes `<path fill="#000" d="M0 0h657v603H0z"/>`.
- `src/features/hero/components/Moon.tsx:13` uses `mix-blend-screen` to make the black canvas visually disappear.
- The production moon resource is 453.29 kB and contains roughly 1,158 paths.

**Root cause**

The exported artwork contains an opaque, full-view-box black path and excessive vector detail for its rendered size. CSS blending was added as a rendering workaround, but it does not remove the malformed background or reduce transfer/parse/paint cost.

**Why it can fail**

`mix-blend-screen` depends on the backdrop. It reproduces transparency over the current black hero, but a future non-black backdrop, isolation/stacking change, screenshot pipeline, or browser blending difference can change the moon's colors. The large source also remains the dominant static asset.

**Smallest safe fix**

1. Export or optimize a transparent copy of the same artwork, removing only the full-canvas black path first.
2. Compare the transparent SVG with a visually lossless WebP/AVIF rendition at the maximum displayed size.
3. Replace the source only after pixel-comparison at mobile and desktop sizes.
4. Remove `mix-blend-screen` once transparency is intrinsic to the asset.

**Edge cases and side effects**

- Black edge pixels may have been authored against the black canvas; inspect antialiasing after removal.
- Do not place stars above the moon to hide the rectangle, because stars would then appear on the lunar surface.
- Aggressive SVG simplification can destroy crater detail. Optimize incrementally and preserve the current dimensions/view box.

### P1 — Add a fallback for composition sizing when `dvh` is unsupported

**Evidence**

- `Hero.tsx:16` correctly uses `h-screen` and conditionally overrides it when `100dvh` is supported.
- `Hero.tsx:20` unconditionally uses `80dvh` inside the composition's only width declaration.

**Root cause**

The hero itself has a legacy `vh` fallback, but the inner composition does not. If a browser rejects `dvh`, it rejects the complete `width: min(756px, 90vw, calc(80dvh * 1.762))` declaration.

**Why it fails**

On browsers without dynamic viewport units, the absolutely positioned, empty composition can lose its definite width. Its aspect ratio and container-query typography then have no reliable sizing basis, potentially collapsing or mis-sizing the heading/moon composition even though the outer hero still fills the screen.

**Smallest safe fix**

Provide a base `vh` width constraint and conditionally override it with the `dvh` form, mirroring the existing hero-height pattern. Keep the same 756:429 ratio and current limits; only add compatibility fallback behavior.

**Edge cases and side effects**

- Mobile browser chrome makes `vh` less exact than `dvh`; that is acceptable only as fallback behavior.
- Test a short landscape viewport because the height-derived width constraint is most likely to win there.

### P1 — Make ripple timing a single source of truth

**Evidence**

- `useStarfield.ts:19` defines `RIPPLE_DURATION_MS = 2600` for spatial delay calculation.
- `utilities.css:15` separately hardcodes `2600ms` for animation duration.

**Root cause**

The wave phase depends on the TypeScript duration matching the CSS duration, but the values live in unrelated files with no enforcement.

**Why it can fail**

A future speed adjustment in only one location will alter wave spacing or wrap delays beyond the actual cycle. Type-checking, linting, and the build cannot detect this visual mismatch.

**Smallest safe fix**

Define the duration once as a CSS custom property on the starfield SVG/component and consume it in both places, or pass a normalized delay ratio from TypeScript and calculate the delay with the same CSS variable. For the smallest patch, add an explicit synchronization comment and a regression check if introducing the custom property is disproportionate.

**Edge cases and side effects**

- Keep generated animation delay values typed as milliseconds.
- Do not introduce global state or a new motion dependency for one constant.
- Positive delays intentionally stage the first ripple: stars waiting to start remain at the same dim base opacity/scale as the 0% keyframe. Add `animation-fill-mode: backwards` only if those base and keyframe states later diverge; it does not currently fix a visible mismatch.

### P1 — Resolve audited dependency vulnerabilities with scoped upgrades

**Evidence**

- `npm audit --omit=dev` reports two moderate React Router advisories.
- Full `npm audit` additionally reports the Vite/esbuild development-server advisory and totals four vulnerabilities (three moderate, one high in the audit summary).
- Source search finds no imports from `react-router-dom`, `framer-motion`, or `lucide-react`.

**Root cause**

Unused future-facing dependencies remain installed, and the current Vite 5 line pulls an affected esbuild version.

**Why it matters**

The Router advisories are not currently exploitable by application code because no routing APIs are used, but they remain supply-chain findings. The esbuild advisory concerns exposure of the development server to malicious websites and is primarily a local-development risk.

**Smallest safe fix**

1. Confirm whether Router, Framer Motion, and Lucide are required by the immediate roadmap.
2. If not required, remove those three unused dependencies; this directly removes the current production Router finding without changing runtime code.
3. If Router is required soon, apply the non-breaking `npm audit fix`, then run type-check/lint/build.
4. Upgrade Vite in a separate, explicit migration. Do not use `npm audit fix --force` blindly because it proposes Vite 8, a major version change.

**Edge cases and side effects**

- Removing dependencies can affect uncommitted or planned code not present in `src`; confirm roadmap ownership first.
- Major Vite upgrades may require a newer Node.js version and plugin/config changes.
- Never expose the Vite development server publicly while the affected version remains installed.

### P2 — Profile the continuously animated SVG before changing architecture

**Evidence**

- `useStarfield.ts:69-73` creates 80–300 stars based on rendered area.
- `Starfield.tsx:22-30` renders one SVG `<circle>` per star.
- `utilities.css:10-30` animates opacity and transform on every circle indefinitely at a 2.6-second cycle.

**Status**

This is a performance risk, not a verified frame-rate defect. SVG transforms are not guaranteed to create independently composited layers, and the faster/brighter animation increases continuous visual activity but does not increase node count.

**Strategy**

Profile sustained frame time, paint activity, CPU usage, and battery impact on representative low-end Android hardware. If a defect is measured, apply fixes in this order:

1. Reduce the area-density divisor or maximum count.
2. Pause animation when `document.visibilityState !== 'visible'`.
3. Animate grouped stars instead of every circle.
4. Consider canvas only if simpler mitigations fail.

**Edge cases and side effects**

- Lower counts change the visual density and deterministic constellation length.
- Canvas reduces DOM work but adds DPR scaling, resize, lifecycle, and testing complexity; it is not currently justified.

### P2 — External font loading remains a resilience and privacy dependency

**Evidence**

- `index.html:8-10` connects to Google and loads Playfair Display 400.
- The heading observer now handles layout changes, so font swapping no longer leaves a stale star exclusion rectangle.

**Root cause and impact**

Typography still depends on a third-party network request. Blocked, offline, privacy-restricted, or slow environments use fallback fonts and incur connection latency. This is no longer a starfield correctness bug, but remains a resilience/performance concern.

**Smallest safe fix**

If project licensing and asset policy permit, self-host a subsetted WOFF2 of the single used weight and use `font-display: swap`. Otherwise keep the current single-weight request; it is already materially smaller than the previous three-weight request.

## Verified non-issues after the fixes

- Hero height tracks `100dvh` where supported and no longer forces a 600 px minimum (`Hero.tsx:16`).
- The composition preserves `756:429` and is constrained by width and dynamic viewport height (`Hero.tsx:20`).
- Star coordinates are measured relative to the rendered hero, not assumed window dimensions (`useStarfield.ts:143-160`).
- `ResizeObserver` tracks hero and heading changes, with animation-frame coalescing and cleanup (`useStarfield.ts:176-199`).
- Star density scales continuously between 80 and 300 (`useStarfield.ts:69-73`).
- The ripple travels center-to-edge with synchronized current values and increased visibility (`useStarfield.ts:19,83-105`; `utilities.css:10-30`).
- Decorative SVG/image content is excluded from accessibility APIs; reduced motion is respected.
- Missing `#root` now produces a clear initialization error (`main.tsx:5-11`).

## Execution order

1. Add the `vh` composition-width fallback and verify short landscape plus a browser without `dvh` support.
2. Remove the moon's opaque source background through an asset export/optimization pass; then remove blending and compare screenshots.
3. Make ripple duration synchronization mechanically safe or add a focused regression guard.
4. Resolve unused/vulnerable dependencies with non-breaking, scoped package changes.
5. Profile mobile animation and only optimize rendering if measurements show a real issue.
6. Decide whether font self-hosting is required by privacy/performance goals.

## Verification matrix

- Run `npm run type-check`, `npm run lint`, and `npm run build` after each independent patch.
- Hard reload at 320×568, 390×844, 844×390, 768 px tablet width, and desktop; observe the first three ripple cycles.
- Confirm center stars brighten before edge stars and the intentional staged startup remains smooth.
- Verify `prefers-reduced-motion: reduce` produces a static, readable field.
- Compare moon screenshots over the existing black background before and after asset replacement; inspect edges at 200% zoom.
- Confirm no rectangular star occlusion remains after removing `mix-blend-screen`.
- Re-run `npm audit --omit=dev` and full `npm audit` after dependency changes.
- Profile—not infer—animation performance on a low-end mobile target.

## Non-goals

Do not redesign the hero, replace the starfield architecture preemptively, introduce a new animation library, or refactor unrelated components. Each change should address one root cause and remain independently reversible.
