import React from 'react';
import MoonSVG from '../../../assets/hero/moon.svg';

export const Moon: React.FC = () => {
  return (
    <div
      className="absolute top-[30%] right-0 pointer-events-none z-0 md:inset-0 md:flex md:items-center md:justify-end"
      aria-hidden="true"
    >
      <img
        src={MoonSVG}
        alt=""
        className="h-auto w-[40vw] max-w-[160px] md:h-[70%] md:w-auto md:max-w-none md:-translate-y-[30px] object-contain"
        loading="eager"
        decoding="async"
        fetchPriority="low"
      />
    </div>
  );
};
