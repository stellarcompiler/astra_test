import gsap from 'gsap'

export function initHeroReveal() {
  const astra = document.getElementById('astra-logo')
  const heroBg = document.querySelector('#hero > div')
  const heroContent = document.getElementById('hero-content')
  const cta = heroContent?.querySelector('a')
  if (!astra || !heroContent) return

  astra.style.animation = 'none'

  const vw = window.innerWidth
  const vh = window.innerHeight
  const rect = astra.getBoundingClientRect()

  const startX = (vw - rect.width) / 2
  const startY = (vh - rect.height) / 2
  const gap = 56

  ;(window as any).__astraStartX = startX
  ;(window as any).__astraStartY = startY
  ;(window as any).__astraInitW = rect.width
  ;(window as any).__astraInitH = rect.height

  astra.style.transform = `translate(${startX}px, ${startY}px)`
  heroContent.style.marginTop = `${startY + rect.height + gap}px`

  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

  tl.to(heroBg, { opacity: 1, duration: 0.8 })
    .to(heroContent, { opacity: 1, duration: 1.8, ease: 'power1.out' }, '-=0.4')
    .to(cta, { opacity: 1, duration: 1.2, ease: 'power1.out' }, '-=0.8')
}
