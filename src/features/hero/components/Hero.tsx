import React, { useRef } from 'react';
import { HeroContent } from './HeroContent';
import { Moon } from './Moon';
import { Starfield } from './Starfield';
import { useStarfield } from '../hooks/useStarfield';

export const Hero: React.FC = () => {
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const stars = useStarfield(heroContainerRef);

  return (
    <section
      aria-label="Hero"
      className="relative w-full h-screen supports-[height:100dvh]:h-[100dvh] min-h-[600px] bg-black overflow-hidden flex items-center justify-center"
    >
      <Starfield stars={stars} />
      <div
        ref={heroContainerRef}
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
