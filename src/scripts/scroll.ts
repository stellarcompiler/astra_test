import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsap from 'gsap'

gsap.registerPlugin(ScrollTrigger)

export function initScrollMorph(startSize: number) {
  const astra = document.getElementById('astra-logo')
  const hero = document.getElementById('hero')
  if (!astra || !hero) return

  const targetSize = 1.25

  const mm = gsap.matchMedia()

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const ctx = gsap.context(() => {
      gsap.killTweensOf(astra)

      let navPad = window.innerWidth * 0.04
      let navTop = 20
      let startX = ((window as any).__astraStartX as number) ?? 0
      let startY = ((window as any).__astraStartY as number) ?? 0

      const recalc = () => {
        const iw = ((window as any).__astraInitW as number) ?? astra.offsetWidth
        const ih = ((window as any).__astraInitH as number) ?? astra.offsetHeight
        navPad = window.innerWidth * 0.04
        startX = (window.innerWidth - iw) / 2
        startY = (window.innerHeight - ih) / 2
      }

      const st = ScrollTrigger.create({
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress

          astra.style.transform = `translate(${startX + (navPad - startX) * p}px, ${startY + (navTop - startY) * p}px)`
          astra.style.fontSize = `${startSize + (targetSize - startSize) * p}rem`
        },
      })

      window.addEventListener('resize', () => {
        recalc()
        st.refresh()
      })
    })

    return () => ctx.revert()
  })
}
