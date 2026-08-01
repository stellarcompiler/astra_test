import React from 'react';

export const HeroContent: React.FC = () => {
  return (
    <h1 className="inline-flex flex-col items-start justify-center z-10 font-serif-hero text-white">
      <span className="text-hero-title uppercase leading-none tracking-tight">ASTRA</span>
      <span
        className="flex items-center gap-3 mt-0.5 text-hero-subtitle uppercase leading-none tracking-tight"
        style={{ marginLeft: '50%' }}
      >
        <span
          className="inline-block w-[0.22em] h-[0.22em] rounded-full bg-accent-red shrink-0"
          aria-hidden="true"
        />
        MEC
      </span>
    </h1>
  );
};
