import React, { useRef } from 'react';
import { HeroContent } from './HeroContent';
import { Moon } from './Moon';
import { Starfield } from './Starfield';
import { useStarfield } from '../hooks/useStarfield';

export const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const heroContentRef = useRef<HTMLHeadingElement>(null);
  const stars = useStarfield(heroRef, heroContentRef);

  return (
    <section
      aria-label="Hero"
      ref={heroRef}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-black supports-[height:100dvh]:h-[100dvh]"
    >
      <Starfield stars={stars} />
      <div
        className="hero-composition absolute left-1/2 top-1/2 aspect-[756/429] h-auto max-h-[80vh]"
        style={{ containerType: 'inline-size', transform: 'translate(-58.9%, -50%)' }}
      >
        <div className="relative z-10 h-full w-full flex items-center justify-center">
          <HeroContent contentRef={heroContentRef} />
        </div>
        <Moon />
      </div>
    </section>
  );
};
