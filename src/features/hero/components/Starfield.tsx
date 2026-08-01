import React from 'react';
import type { Star } from '../hooks/useStarfield';

interface StarfieldProps {
  stars: Star[];
}

/**
 * Layer 1 (Starfield): a decorative, full-viewport SVG constellation.
 *
 * Critical interaction rule: `pointer-events: none` keeps clicks and text
 * selection working on the Hero Content layer above. The layer is strictly
 * decorative (`aria-hidden`), so screen readers ignore the dots.
 */
export const Starfield: React.FC<StarfieldProps> = ({ stars }) => {
  return (
    <svg
      className="absolute inset-0 z-0 h-full w-full pointer-events-none"
      aria-hidden="true"
      focusable="false"
    >
      {stars.map((star) => (
        <circle
          key={star.id}
          className="star"
          cx={star.cx}
          cy={star.cy}
          r={star.r}
          style={{ animationDelay: `${star.delay}ms` }}
        />
      ))}
    </svg>
  );
};
