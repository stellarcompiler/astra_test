import React from 'react';

export const HeroContent: React.FC = () => {
  return (
    <div className="inline-flex flex-col items-start justify-center z-10">
      <h1 className="font-serif-hero text-white uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(3rem, 12cqw, 7.5rem)' }}>
        ASTRA
      </h1>
      <div className="flex items-center gap-3 mt-0.5" style={{ marginLeft: '50%' }}>
        <span
          className="inline-block w-[0.22em] h-[0.22em] rounded-full bg-accent-red shrink-0"
          aria-hidden="true"
          style={{ fontSize: 'clamp(2.5rem, 10cqw, 6rem)' }}
        />
        <span className="font-serif-hero text-white uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(2.5rem, 10cqw, 6rem)' }}>
          MEC
        </span>
      </div>
    </div>
  );
};
