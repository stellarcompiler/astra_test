import { useLayoutEffect, useState } from 'react';
import type { RefObject } from 'react';

export interface Star {
  id: number;
  cx: number;
  cy: number;
  r: number;
  delayRatio: number;
}

interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

const RIPPLE_SAFETY_FACTOR = 0.85;
const SEED = 0x2a3f;

const MOBILE_STAR_COUNT = 80;
const DESKTOP_STAR_COUNT = 350;

const STAR_RADIUS = 0.84;
const CONTENT_PADDING = 24;

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

/** Deterministic PRNG (mulberry32). The same seed always produces the same constellation. */
function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function distanceBetween(x: number, y: number, centerX: number, centerY: number): number {
  return Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
}

function isInsideRect(x: number, y: number, rect: Rect): boolean {
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

/**
 * Generates the deterministic star constellation for the given viewport size.
 *
 * Stars are scattered uniformly across the viewport (no clustering) so the
 * field reads as a natural, even sky. Positions are stored in pixels relative
 * to the hero viewport, so the radial ripple is geometrically circular
 * regardless of the screen's aspect ratio. The ripple origin is the centre of
 * the screen and expands outward. Each star's delay is derived from its
 * distance to the centre, so the pulse reads as a gradual brightness wave:
 * rings closer to the centre brighten first, then dim as the brightness
 * travels outward. Stars are simple, uniform dots and none are placed behind
 * the hero's text content.
 */
function createStars(viewportWidth: number, viewportHeight: number, contentRect: Rect | null): Star[] {
  const centerX = viewportWidth / 2;
  const centerY = viewportHeight / 2;

  const starCount = clamp(
    Math.round((viewportWidth * viewportHeight) / 3000),
    MOBILE_STAR_COUNT,
    DESKTOP_STAR_COUNT,
  );
  const random = mulberry32(SEED);

  const corners = [
    distanceBetween(0, 0, centerX, centerY),
    distanceBetween(viewportWidth, 0, centerX, centerY),
    distanceBetween(0, viewportHeight, centerX, centerY),
    distanceBetween(viewportWidth, viewportHeight, centerX, centerY),
  ];
  const maxDistance = Math.max(...corners);

  const generated: Star[] = [];
  const maxAttempts = starCount * 10;
  let attempts = 0;

  while (generated.length < starCount && attempts < maxAttempts) {
    attempts += 1;

    const cx = random() * viewportWidth;
    const cy = random() * viewportHeight;

    // Keep the hero text readable: never place a star behind it.
    if (contentRect && isInsideRect(cx, cy, contentRect)) continue;

    const distance = distanceBetween(cx, cy, centerX, centerY);
    generated.push({
      id: generated.length,
      cx,
      cy,
      r: STAR_RADIUS,
      // A positive distance delay makes the centre reach the bright part first.
      delayRatio: (distance / maxDistance) * RIPPLE_SAFETY_FACTOR,
    });
  }

  return generated;
}

/**
 * Generates and keeps the starfield in sync with the viewport size.
 *
 * The constellation is recomputed whenever the viewport changes — browser
 * resize, fullscreen toggling, mobile toolbar show/hide, or orientation
 * changes — so the stars always fill the whole screen. Recomputes are
 * coalesced through `requestAnimationFrame` to avoid wasted work during
 * drag-resize, and the fixed seed keeps the pattern identical at every size.
 *
 * Only the hero's text content is kept star-free (tightly padded), not the
 * full hero container box, so the stars populate all around the hero without
 * leaving a rectangular dead zone around it.
 */
export function useStarfield(
  heroRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
): Star[] {
  const [stars, setStars] = useState<Star[]>([]);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    const content = contentRef.current;
    if (!hero || !content) return;

    let frame = 0;
    let lastWidth = 0;
    let lastHeight = 0;
    let lastContentRect = '';

    const generate = () => {
      frame = 0;
      const heroRect = hero.getBoundingClientRect();
      const viewportWidth = heroRect.width;
      const viewportHeight = heroRect.height;
      if (viewportWidth === 0 || viewportHeight === 0) return;

      const contentRect = content.getBoundingClientRect();
      const relativeContentRect = {
        left: contentRect.left - heroRect.left,
        top: contentRect.top - heroRect.top,
        right: contentRect.right - heroRect.left,
        bottom: contentRect.bottom - heroRect.top,
      };
      const paddedRect: Rect = {
        left: relativeContentRect.left - CONTENT_PADDING,
        top: relativeContentRect.top - CONTENT_PADDING,
        right: relativeContentRect.right + CONTENT_PADDING,
        bottom: relativeContentRect.bottom + CONTENT_PADDING,
      };

      const contentRectKey = Object.values(relativeContentRect).join(',');
      if (
        viewportWidth === lastWidth &&
        viewportHeight === lastHeight &&
        contentRectKey === lastContentRect
      ) return;

      lastWidth = viewportWidth;
      lastHeight = viewportHeight;
      lastContentRect = contentRectKey;

      setStars(createStars(viewportWidth, viewportHeight, paddedRect));
    };

    const scheduleGenerate = () => {
      if (frame === 0) {
        frame = requestAnimationFrame(generate);
      }
    };

    generate();

    window.addEventListener('resize', scheduleGenerate);
    document.addEventListener('fullscreenchange', scheduleGenerate);

    const resizeObserver = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(scheduleGenerate);
    resizeObserver?.observe(hero);
    resizeObserver?.observe(content);

    return () => {
      if (frame !== 0) cancelAnimationFrame(frame);
      window.removeEventListener('resize', scheduleGenerate);
      document.removeEventListener('fullscreenchange', scheduleGenerate);
      resizeObserver?.disconnect();
    };
  }, [contentRef, heroRef]);

  return stars;
}
