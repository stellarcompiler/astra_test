import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function initSmoothScroll(): Lenis | null {
  const mm = gsap.matchMedia()

  let lenis: Lenis | null = null

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time: number) => {
      lenis?.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis?.destroy()
      lenis = null
    }
  })

  return lenis
}
