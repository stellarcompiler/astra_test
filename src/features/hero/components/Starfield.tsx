import React from 'react';
import type { Star } from '../hooks/useStarfield';

interface StarfieldProps {
  stars: Star[];
}

const RIPPLE_GROUP_COUNT = 12;

/**
 * Layer 1 (Starfield): a decorative, full-viewport SVG constellation.
 *
 * Critical interaction rule: `pointer-events: none` keeps clicks and text
 * selection working on the Hero Content layer above. The layer is strictly
 * decorative (`aria-hidden`), so screen readers ignore the dots.
 */
export const Starfield: React.FC<StarfieldProps> = ({ stars }) => {
  const groups = Array.from({ length: RIPPLE_GROUP_COUNT }, () => [] as Star[]);

  stars.forEach((star) => {
    const groupIndex = Math.min(
      RIPPLE_GROUP_COUNT - 1,
      Math.floor(star.delayRatio * RIPPLE_GROUP_COUNT),
    );
    groups[groupIndex].push(star);
  });

  return (
    <svg
      className="starfield absolute inset-0 z-0 h-full w-full pointer-events-none"
      aria-hidden="true"
      focusable="false"
    >
      {groups.map((group, groupIndex) => (
        <g
          key={groupIndex}
          className="star-group"
          style={{
            animationDelay: `calc(var(--ripple-duration) * ${groupIndex / RIPPLE_GROUP_COUNT})`,
          }}
        >
          {group.map((star) => (
            <circle key={star.id} className="star-dot" cx={star.cx} cy={star.cy} r={star.r} />
          ))}
        </g>
      ))}
    </svg>
  );
};
