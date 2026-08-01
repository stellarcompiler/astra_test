import React from 'react';
import MoonSVG from '../../../assets/hero/moon.svg';

export const Moon: React.FC = () => {
  return (
    <div
      className="absolute inset-0 flex items-center justify-end pointer-events-none z-0"
      aria-hidden="true"
    >
      <img
        src={MoonSVG}
        alt=""
        className="h-[70%] w-auto object-contain"
        style={{ transform: 'translateY(-30px)' }}
        loading="eager"
        decoding="async"
        fetchPriority="low"
      />
    </div>
  );
};
