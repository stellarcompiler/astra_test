# Production Implementation Strategy: Astra Mec Starfield

## 1. Architectural Decomposition
The implementation requires a strict three-layer composition to ensure z-index isolation, performance, and interaction safety.

*   **Layer 0 (Base):** Solid black background (`#000000`).
*   **Layer 1 (Starfield):** An absolute positioned container (`inset-0`, `z-0`).
    *   **Critical Interaction Rule:** Must explicitly have `pointer-events: none`. Without this, the full-viewport layer will intercept clicks and block text selection on the Hero Content.
    *   Must be strictly decorative (`aria-hidden="true"`).
*   **Layer 2 (Hero Content):** Relative positioned container (`z-10`). Holds the typography and moon graphic.

## 2. Star Generation Logic (Deterministic Constellation)
To achieve the "constellation structure" (clumps of stars) while ensuring the design remains consistent across reloads, we must move away from `Math.random()`.

*   **Seeded Randomness:** Implement a Seeded Pseudo-Random Number Generator (PRNG). This ensures that the "random" constellation looks identical every time the user visits the page, allowing for precise tuning to match the reference image.
*   **Clustering Algorithm:**
    1.  Define 5–8 "Anchor Points" randomly across the canvas using the seeded PRNG.
    2.  For the total star count (budget: 60–120 for mobile, up to 200 for desktop), assign each star to a random Anchor Point.
    3.  Calculate the star's position by adding a randomized offset to the Anchor Point coordinates. This creates the "clumps."
*   **Aspect-Correct Distance Calculation (The Fix for Ellipse Ripple):**
    *   Do not calculate distance using raw percentages (0-100), as 1% width is not equal to 1% height on wide screens.
    *   **Logic:** Normalize the coordinates based on the viewport aspect ratio before calculating the Euclidean distance from the center.
    *   *Formula Logic:* `NormalizedX = (StarX - CenterX) / AspectRatio`. Then calculate distance using `NormalizedX` and `StarY`. This ensures the ripple is a perfect circle, not an oval.
    *   *Resize Edge Case:* This calculation is performed once at generation. Rotating a mobile device or resizing the window will slightly distort the ripple shape until reload. This is acceptable for a purely decorative effect and avoids unnecessary recalculation overhead.

## 3. Animation Strategy (The Radial Ripple)
To avoid main-thread jank and ensure 60FPS on mobile devices, **do not use JavaScript-driven animations (like Framer Motion) for the stars.** Instead, use CSS Keyframes which run on the browser's compositor thread.

*   **The Primitive:** Use SVG `<circle>` elements. This provides crisp, deterministic rendering regardless of font loading or anti-aliasing settings.
*   **The Transform Fix (Critical for SVG Scaling):**
    *   Animating `scale` on an SVG element defaults to scaling from the SVG viewport origin (0,0), causing stars to fly away from their positions.
    *   **Requirement:** Every SVG circle must have `transform-box: fill-box` and `transform-origin: center` applied via CSS. This ensures the scale animation happens relative to the star's own center.
*   **The Animation Definition:**
    *   Define a CSS `@keyframes` animation named `ripple-pulse`.
    *   **Keyframes:** Animate `opacity` (0.2 → 1.0 → 0.2) and `transform: scale` (0.8 → 1.2 → 0.8).
    *   **Crucial Exclusion:** Do **not** animate `text-shadow` or `box-shadow`. These properties trigger repaints and cause severe performance drops on mobile.
*   **The Wavefront Logic & Initial Paint Fix:**
    *   **Negative Delay & Base State:** To prevent a "flash" where outer stars render at full brightness before their animation starts, set the stars' base CSS opacity to the dim state (0.2) and use **negative `animation-delay`**.
    *   *Formula:* `Delay = -1 * (DistanceFromCenter * RippleSpeedConstant)`.
    *   This ensures the wave is "fully formed" and already moving at `t=0` (page load), creating an immediate, seamless ripple effect.
    *   **Wavefront Invariant:** To maintain a clean, single wavefront without overlapping pulses, ensure that `Max(Distance) * Speed <= Duration`. If the absolute delay of the furthest star exceeds the animation duration, a second wave will start before the first finishes, breaking the visual logic.

## 4. Accessibility & Performance Constraints
This section is critical for meeting WCAG standards and mobile performance budgets.

*   **Screen Readers:** The Starfield container must have `aria-hidden="true"`. It is purely decorative; without this, screen readers will attempt to read hundreds of dots.
*   **Reduced Motion:** Implement a CSS media query `@media (prefers-reduced-motion: reduce)`.
    *   Inside this query, disable the animation (`animation: none`).
    *   Set a static, low opacity for all stars (e.g., 0.5) to maintain the visual context without the motion.
*   **Memory Management:** Do **not** apply `will-change` to the stars. Creating 150+ compositing layers causes memory pressure. `opacity` and `transform` are already optimized by the browser.
*   **Mobile Budget:** Detect device capability or screen width. If mobile, cap the star count at ~60-80. If desktop, allow up to 150-200.

## 5. Hero Content & Design Tokens
*   **Ripple Origin:** The ripple must emerge from the *Hero Container's center*, not the raw viewport center (50vw/50vh), as the hero content is visually offset. Calculate the center based on the specific container's bounding box.
*   **Color Accuracy:** The red dot separating "ASTRA" and "MEC" must use the specific design token `--color-accent-red` (or `#ff0000`), not the generic Tailwind `red-600`.
*   **Layout:** Use Flexbox or Grid to align the text and the Moon SVG. Ensure the Moon SVG is positioned to the right, potentially using negative margins or absolute positioning to achieve the overlap seen in the reference.

## 6. Validation Gate
Before merging, the implementation must pass the following checks:

1.  **Visual (Transform):** Do the stars scale in place? (Validates `transform-box: fill-box`). If they move away from their coordinates, the transform origin is incorrect.
2.  **Visual (Shape):** Does the ripple look circular on an ultrawide monitor? (Validates Aspect-Correct Distance).
3.  **Visual (Timing):** Is there a flash of bright stars on load? (Validates Negative Delay logic). Does the wave overlap itself? (Validates Wavefront Invariant).
4.  **Performance:** Does the frame rate stay above 55fps on a mid-range mobile device during the animation loop? (Validates CSS Keyframes vs JS).
5.  **Accessibility:** Does the site pass an audit with `prefers-reduced-motion` enabled? (Validates static fallback).
6.  **Interaction:** Can you select the text "ASTRA MEC" and click buttons? (Validates `pointer-events: none`).