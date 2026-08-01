import React from 'react';
import { HeroContent } from './HeroContent';
import { Moon } from './Moon';

export const Hero: React.FC = () => {
  return (
    <section
      aria-label="Hero"
      className="relative w-full h-[100dvh] min-h-[600px] bg-black overflow-hidden select-none flex items-center justify-center"
    >
      <div
        className="absolute left-1/2 top-1/2 w-[756px] h-[429px] max-w-[90vw] max-h-[80vh]"
        style={{ aspectRatio: '756 / 429', containerType: 'inline-size', transform: 'translate(-58.9%, -50%)' }}
      >
        <div className="relative z-10 h-full w-full flex items-center justify-center">
          <HeroContent />
        </div>
        <Moon />
      </div>
    </section>
  );
};
