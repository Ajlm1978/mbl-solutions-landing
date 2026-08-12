import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, FormEvent, MutableRefObject, ReactNode } from 'react'

// ============================================================
// IMAGES — placeholders programáticos (F6 reemplaza por IA aprobadas)
// ============================================================
const HERO_IMAGE = '/img/hero.webp'
const SECTION2_IMAGE = '/img/section2.webp'
const SECTION3_IMG1 = '/img/s3-detail-1.webp'
const SECTION3_IMG2 = '/img/s3-detail-2.webp'
const SECTION3_BG = '/img/s3-portrait.webp'

// ============================================================
// DATA
// ============================================================
const featureBars = ['Revenue Cycle Management', 'Denial Management', 'A/R Recovery']

const services: { name: string; num: string | null; active: boolean }[] = [
  { name: 'Medical\nBilling', num: '01', active: true },
  { name: 'Denial\nAppeals', num: '02', active: false },
  { name: 'RCM\nOversight', num: '03', active: false },
  { name: 'A/R\nRecovery', num: null, active: false },
]

const navLinks: { label: string; href: string }[] = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Why MBL', href: '#why-mbl' },
  { label: 'Process', href: '#why-mbl' },
  { label: 'Contact', href: '#contact' },
]

// ============================================================
// HOOKS
// ============================================================
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia('(max-width: 767px)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return isMobile
}

type MaskPos = { x: number; y: number; sw: number; sh: number }

function useMaskPositions(
  sectionRef: MutableRefObject<HTMLElement | null>,
  cardRefs: MutableRefObject<(HTMLDivElement | null)[]>,
  count: number,
): MaskPos[] {
  const [positions, setPositions] = useState<MaskPos[]>([])
  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const compute = () => {
      const sRect = section.getBoundingClientRect()
      const next: MaskPos[] = []
      for (let i = 0; i < count; i++) {
        const el = cardRefs.current[i]
        if (el) {
          const r = el.getBoundingClientRect()
          next.push({ x: r.left - sRect.left, y: r.top - sRect.top, sw: sRect.width, sh: sRect.height })
        } else {
          next.push({ x: 0, y: 0, sw: sRect.width, sh: sRect.height })
        }
      }
      setPositions(next)
    }
    compute()
    const ro = new ResizeObserver(compute)
    ro.observe(section)
    window.addEventListener('resize', compute)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', compute)
    }
  }, [sectionRef, cardRefs, count])
  return positions
}

function useImageWidth(src: string, sectionHeight: number): number {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    if (!sectionHeight) return
    const img = new Image()
    img.onload = () => {
      if (img.naturalHeight > 0) {
        setWidth(img.naturalWidth * (sectionHeight / img.naturalHeight))
      }
    }
    img.src = src
  }, [src, sectionHeight])
  return width
}

function useStaggeredReveal(threshold = 0.15) {
  const containerRef = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)
  const reduced = usePrefersReducedMotion()
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  const getAnimStyle = useCallback(
    (index: number): CSSProperties => {
      if (reduced) return {}
      return {
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 120}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 120}ms`,
      }
    },
    [visible, reduced],
  )
  return { containerRef, getAnimStyle }
}

// ============================================================
// MASKED CARD
// ============================================================
type MaskedCardProps = {
  bgImage: string
  position?: MaskPos
  imageWidth: number
  focalX: number
  className?: string
  children?: ReactNode
  cardRef?: (el: HTMLDivElement | null) => void
  style?: CSSProperties
}

function MaskedCard({ bgImage, position, imageWidth, focalX, className, children, cardRef, style }: MaskedCardProps) {
  const ready = position && position.sh > 0
  const overflow = ready && imageWidth > position.sw ? imageWidth - position.sw : 0
  const focalOffset = overflow * focalX
  const bgStyle: CSSProperties = ready
    ? {
        backgroundImage: `url(${bgImage})`,
        backgroundSize: `auto ${position.sh}px`,
        backgroundPosition: `-${position.x + focalOffset}px -${position.y}px`,
        backgroundRepeat: 'no-repeat',
      }
    : { backgroundColor: '#e7e5e4' }
  return (
    <div ref={cardRef} className={className} style={{ ...style, ...bgStyle }}>
      {children}
    </div>
  )
}

// ============================================================
// SPLASH SCREEN
// ============================================================
function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0)
  const [exiting, setExiting] = useState(false)
  const reduced = usePrefersReducedMotion()
  useEffect(() => {
    if (reduced) {
      onComplete()
      return
    }
    let c = 0
    const timers: number[] = []
    const iv = window.setInterval(() => {
      c += 1
      setCount(c)
      if (c >= 100) {
        window.clearInterval(iv)
        timers.push(window.setTimeout(() => setExiting(true), 200))
        timers.push(window.setTimeout(onComplete, 900))
      }
    }, 20)
    return () => {
      window.clearInterval(iv)
      timers.forEach(window.clearTimeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  if (reduced) return null
  return (
    <div
      className={`fixed inset-0 z-[100] bg-white flex items-end justify-start transition-opacity duration-700 ${exiting ? 'opacity-0' : 'opacity-100'}`}
    >
      <span
        className={`text-7xl md:text-9xl font-bold tabular-nums p-6 md:p-10 leading-none transition-colors duration-300 ${count >= 100 ? 'text-teal-600' : 'text-black'}`}
      >
        {count}
      </span>
    </div>
  )
}

// ============================================================
// NAVBAR
// ============================================================
function Navbar() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-6 py-2 md:py-3 bg-white/80 backdrop-blur-md">
        <a href="#home" className="flex flex-col">
          <span className="text-xl md:text-2xl font-extrabold uppercase tracking-tight leading-none text-black">MBL</span>
          <span className="text-xl md:text-2xl font-extrabold uppercase tracking-tight leading-none -mt-1.5 md:-mt-2 text-black">Solutions</span>
          <span className="text-[8px] md:text-[9px] font-medium leading-none mt-1.5 md:mt-2 text-black">medical billing &amp; rcm</span>
        </a>
        <div className="hidden md:flex items-center gap-6">
          <span className="text-sm font-semibold text-black">Free Billing Audit</span>
          <a
            href="#services"
            className="px-6 py-3 bg-white rounded-full border border-black text-sm font-semibold text-black hover:bg-black hover:text-white transition-colors duration-200"
          >
            Menu
          </a>
        </div>
        <button
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden w-10 h-10 flex items-center justify-center relative"
        >
          <span
            className={`absolute h-0.5 w-6 bg-black rounded-full transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${open ? 'rotate-45 translate-y-0' : '-translate-y-2'}`}
          />
          <span
            className={`absolute h-0.5 w-6 bg-black rounded-full transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${open ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'}`}
          />
          <span
            className={`absolute h-0.5 w-6 bg-black rounded-full transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${open ? '-rotate-45 translate-y-0' : 'translate-y-2'}`}
          />
        </button>
      </header>

      {/* Mobile menu overlay */}
      <div className={`md:hidden fixed inset-0 z-40 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div
          className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-500 ${open ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setOpen(false)}
        />
        <nav
          className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${open ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex flex-col justify-center h-full px-8 gap-1">
            {navLinks.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`text-4xl font-bold text-black hover:text-neutral-500 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${open ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
                style={{ transitionDelay: open ? `${100 + i * 60}ms` : '0ms' }}
              >
                {link.label}
              </a>
            ))}
            <div
              className={`mt-8 pt-8 border-t border-neutral-200 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${open ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
              style={{ transitionDelay: open ? '450ms' : '0ms' }}
            >
              <p className="text-sm font-semibold text-black mb-4">Free Billing Audit</p>
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="block text-center w-full px-6 py-4 bg-teal-600 rounded-full text-white text-sm font-semibold hover:bg-teal-700 transition-colors duration-200"
              >
                Schedule Free Consultation
              </a>
            </div>
          </div>
        </nav>
      </div>
    </>
  )
}

// ============================================================
// SECTION 1 — HERO
// ============================================================
function SectionHero() {
  const isMobile = useIsMobile()
  const sectionRef = useRef<HTMLElement | null>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const positions = useMaskPositions(sectionRef, cardRefs, 4)
  const sh = positions[0]?.sh ?? 0
  const imageWidth = useImageWidth(HERO_IMAGE, sh)
  const reveal = useStaggeredReveal()
  const focalX = isMobile ? 0.7 : 0.8
  return (
    <section
      id="home"
      ref={(el) => {
        sectionRef.current = el
        reveal.containerRef.current = el
      }}
      className="h-screen w-full overflow-hidden flex flex-col pt-24 md:pt-24 px-3 md:px-5 pb-1.5 md:pb-2 gap-1.5 md:gap-2"
    >
      {featureBars.map((label, i) => (
        <MaskedCard
          key={label}
          bgImage={HERO_IMAGE}
          position={positions[i]}
          imageWidth={imageWidth}
          focalX={focalX}
          cardRef={(el) => {
            cardRefs.current[i] = el
          }}
          className="w-full h-14 md:h-20 shrink-0 rounded-xl md:rounded-2xl overflow-hidden relative group cursor-default transition-transform duration-300 hover:scale-[1.01]"
          style={reveal.getAnimStyle(i)}
        >
          <span className="flex items-center justify-center gap-3 h-full text-black text-lg md:text-3xl font-bold text-center relative z-10">
            <span className="w-2 h-2 rounded-full bg-teal-600 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300" />
            {label}
          </span>
        </MaskedCard>
      ))}
      <MaskedCard
        bgImage={HERO_IMAGE}
        position={positions[3]}
        imageWidth={imageWidth}
        focalX={focalX}
        cardRef={(el) => {
          cardRefs.current[3] = el
        }}
        className="w-full flex-1 min-h-0 rounded-xl md:rounded-2xl overflow-hidden relative"
        style={reveal.getAnimStyle(3)}
      >
        <p className="absolute top-4 left-4 md:top-7 md:left-7 text-black text-xs md:text-sm font-semibold leading-4 md:leading-5 max-w-[200px] md:max-w-[300px] z-10">
          We make sure your practice collects
          <br />
          every dollar it has earned
        </p>
        <div className="absolute bottom-5 left-3 md:bottom-8 md:left-4 z-10">
          <span className="flex items-center gap-2 text-black text-xs md:text-sm font-semibold mb-1 md:mb-2">
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
            Trusted Medical Billing Partner
          </span>
          <h1 className="text-black text-[clamp(3rem,11vw,11rem)] font-bold leading-[0.79] tracking-tight">
            Billing
            <br />
            Experts
          </h1>
        </div>
        <a
          href="#contact"
          className="group absolute bottom-6 right-4 md:bottom-10 md:right-8 text-teal-300 text-xs md:text-sm font-semibold z-10 flex items-center gap-2"
        >
          Free Billing Audit
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
        </a>
      </MaskedCard>
    </section>
  )
}

// ============================================================
// SECTION 2 — SERVICES
// ============================================================
function SectionServices() {
  const isMobile = useIsMobile()
  const sectionRef = useRef<HTMLElement | null>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const positions = useMaskPositions(sectionRef, cardRefs, 4)
  const sh = positions[0]?.sh ?? 0
  const imageWidth = useImageWidth(SECTION2_IMAGE, sh)
  const reveal = useStaggeredReveal()
  const focalX = isMobile ? 0.65 : 0.8
  return (
    <section
      id="services"
      ref={(el) => {
        sectionRef.current = el
        reveal.containerRef.current = el
      }}
      className="min-h-screen md:h-screen w-full overflow-hidden flex flex-col pt-1.5 md:pt-2 px-3 md:px-5 pb-1.5 md:pb-2 gap-1.5 md:gap-2"
    >
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 grid-rows-[auto_auto_auto_auto] md:grid-rows-[1fr_1fr_0.8fr] gap-1.5 md:gap-2">
        {/* Card 0 — Our Services */}
        <MaskedCard
          bgImage={SECTION2_IMAGE}
          position={positions[0]}
          imageWidth={imageWidth}
          focalX={focalX}
          cardRef={(el) => {
            cardRefs.current[0] = el
          }}
          className="rounded-xl md:rounded-2xl overflow-hidden relative min-h-[160px] md:min-h-0"
          style={reveal.getAnimStyle(0)}
        >
          <h2 className="absolute top-4 left-5 md:top-6 md:left-7 flex items-center gap-2.5 text-white md:text-black text-2xl md:text-3xl font-bold z-10">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
            Our Services
          </h2>
          <p className="absolute bottom-4 left-5 md:bottom-6 md:left-7 text-white md:text-black text-xs md:text-sm font-semibold z-10">
            End-to-end revenue cycle support
          </p>
        </MaskedCard>

        {/* Card 1 — tall right */}
        <MaskedCard
          bgImage={SECTION2_IMAGE}
          position={positions[1]}
          imageWidth={imageWidth}
          focalX={focalX}
          cardRef={(el) => {
            cardRefs.current[1] = el
          }}
          className="md:row-span-2 rounded-xl md:rounded-2xl overflow-hidden relative min-h-[200px] md:min-h-0"
          style={reveal.getAnimStyle(1)}
        >
          <p className="absolute bottom-16 left-5 md:bottom-20 md:left-7 text-white text-xs md:text-sm font-semibold leading-4 md:leading-5 z-10">
            Tired of denied claims and delayed payments?
            <br />
            We investigate, correct, and appeal — relentlessly.
          </p>
          <a
            href="#contact"
            className="absolute bottom-4 right-4 md:bottom-6 md:right-6 px-5 py-3 md:px-8 md:py-5 bg-teal-600 rounded-full text-white text-base md:text-xl font-bold z-10 hover:scale-105 hover:bg-teal-700 transition-all"
          >
            Get My Audit
          </a>
        </MaskedCard>

        {/* Card 2 — Denial Management */}
        <MaskedCard
          bgImage={SECTION2_IMAGE}
          position={positions[2]}
          imageWidth={imageWidth}
          focalX={focalX}
          cardRef={(el) => {
            cardRefs.current[2] = el
          }}
          className="rounded-xl md:rounded-2xl overflow-hidden relative min-h-[160px] md:min-h-0"
          style={reveal.getAnimStyle(2)}
        >
          <h3 className="absolute top-4 left-5 md:top-6 md:left-7 text-white md:text-black text-[clamp(3rem,7vw,6rem)] font-bold leading-[0.9] z-10">
            Denial
            <br />
            Management
          </h3>
        </MaskedCard>

        {/* Card 3 — services strip */}
        <MaskedCard
          bgImage={SECTION2_IMAGE}
          position={positions[3]}
          imageWidth={imageWidth}
          focalX={focalX}
          cardRef={(el) => {
            cardRefs.current[3] = el
          }}
          className="col-span-1 md:col-span-2 rounded-xl md:rounded-2xl overflow-hidden relative min-h-[200px] md:min-h-0"
          style={reveal.getAnimStyle(3)}
        >
          <div className="absolute inset-0 z-10 flex flex-wrap md:flex-nowrap gap-1.5 md:gap-2 p-2 md:p-3">
            {services.map((svc) => (
              <div
                key={svc.name}
                className={`flex-1 min-w-[calc(50%-4px)] md:min-w-0 rounded-xl md:rounded-2xl p-3 md:p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${svc.active ? 'bg-white/90 backdrop-blur-md' : 'bg-white/20 backdrop-blur-xl hover:bg-white/30'}`}
              >
                <h3
                  className={`text-xl md:text-4xl font-bold leading-[1.05] whitespace-pre-line ${svc.active ? 'text-black' : 'text-white'}`}
                >
                  {svc.name}
                </h3>
                {svc.num && (
                  <span
                    className={`self-end w-8 h-8 md:w-12 md:h-12 rounded-full border flex items-center justify-center text-xs md:text-sm font-semibold ${svc.active ? 'border-teal-600 text-teal-600' : 'border-white text-white'}`}
                  >
                    {svc.num}
                  </span>
                )}
              </div>
            ))}
          </div>
        </MaskedCard>
      </div>
    </section>
  )
}

// ============================================================
// SECTION 3 — WHY MBL
// ============================================================
function ArrowIcon({ white = false }: { white?: boolean }) {
  return (
    <span
      className={`self-end w-9 h-9 md:w-12 md:h-12 rounded-full border flex items-center justify-center transition-all duration-300 group-hover:bg-teal-600 group-hover:border-teal-600 group-hover:text-white ${white ? 'border-white text-white' : 'border-black text-black'}`}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        className="rotate-[-45deg] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:rotate-0"
      >
        <path
          d="M1 7h12m0 0L8 2m5 5L8 12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

function SectionWhyMbl() {
  const reveal = useStaggeredReveal()
  return (
    <section
      id="why-mbl"
      ref={(el) => {
        reveal.containerRef.current = el
      }}
      className="min-h-screen md:h-screen w-full overflow-hidden flex flex-col pt-1.5 md:pt-2 px-3 md:px-5 pb-1.5 md:pb-2 gap-1.5 md:gap-2"
    >
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-1.5 md:gap-2">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-1.5 md:gap-2">
          <div
            className="rounded-xl md:rounded-2xl bg-stone-50 p-5 md:p-7 flex flex-col justify-between flex-[1.2] min-h-[180px] md:min-h-0"
            style={reveal.getAnimStyle(0)}
          >
            <h2 className="text-[clamp(3rem,7vw,6.5rem)] font-bold leading-[0.95] text-black">
              Why
              <br />
              MBL
            </h2>
            <p className="flex items-center gap-2 text-xs md:text-sm font-semibold text-black">
              Compliance <span className="w-1.5 h-1.5 rounded-full bg-teal-600" /> Transparency{' '}
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600" /> Results
            </p>
          </div>
          <div className="flex gap-1.5 md:gap-2 flex-1 min-h-[140px] md:min-h-0" style={reveal.getAnimStyle(1)}>
            <div className="flex-1 rounded-xl md:rounded-2xl overflow-hidden">
              <img src={SECTION3_IMG1} alt="Revenue analytics review" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 rounded-xl md:rounded-2xl overflow-hidden">
              <img src={SECTION3_IMG2} alt="Medical practice operations" className="w-full h-full object-cover" />
            </div>
          </div>
          <div
            className="rounded-xl md:rounded-2xl bg-zinc-200 p-5 md:p-7 flex items-end justify-between flex-[0.8] min-h-[160px] md:min-h-0"
            style={reveal.getAnimStyle(2)}
          >
            <div>
              <p className="text-xs md:text-sm font-semibold text-black mb-2 md:mb-3">Consultation</p>
              <h3 className="text-xl md:text-3xl font-bold text-black leading-6 md:leading-8">
                Free
                <br />
                Billing
                <br />
                Audit
              </h3>
            </div>
            <a
              href="#contact"
              className="px-5 py-3 md:px-8 md:py-5 bg-teal-600 rounded-full text-white text-base md:text-xl font-bold hover:scale-105 hover:bg-teal-700 transition-all"
            >
              Book Online
            </a>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="rounded-xl md:rounded-2xl overflow-hidden relative min-h-[350px] md:min-h-0" style={reveal.getAnimStyle(3)}>
          <img src={SECTION3_BG} alt="Healthcare professional" className="w-full h-full object-cover" />
          <div className="absolute bottom-3 left-3 right-3 md:bottom-5 md:left-5 md:right-5 flex gap-1.5 md:gap-2">
            <div className="group flex-1 bg-white rounded-xl md:rounded-2xl p-3 md:p-5 flex flex-col justify-between h-36 md:h-52 transition-transform duration-300 hover:-translate-y-1">
              <h4 className="text-lg md:text-2xl font-bold text-black leading-5 md:leading-7">
                How We
                <br />
                Recover Your
                <br />
                Revenue
              </h4>
              <ArrowIcon />
            </div>
            <div className="group flex-1 bg-white/20 backdrop-blur-xl rounded-xl md:rounded-2xl p-3 md:p-5 flex flex-col justify-between h-36 md:h-52 transition-transform duration-300 hover:-translate-y-1">
              <h4 className="text-lg md:text-2xl font-bold text-white leading-5 md:leading-7">
                HIPAA-
                <br />
                Compliant
                <br />
                Operations
              </h4>
              <ArrowIcon white />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================
// SECTION 4 — CONTACT / LEAD FORM
// ============================================================
type FormStatus = 'idle' | 'loading' | 'success' | 'error'

const formFields: { id: string; label: string; type: string; placeholder: string }[] = [
  { id: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Dr. Jane Smith' },
  { id: 'practiceName', label: 'Practice / Clinic Name', type: 'text', placeholder: 'Smith Family Medicine' },
  { id: 'specialty', label: 'Medical Specialty', type: 'text', placeholder: 'Family Medicine' },
  { id: 'email', label: 'Email', type: 'email', placeholder: 'jane@practice.com' },
  { id: 'phone', label: 'Phone', type: 'tel', placeholder: '(555) 000-0000' },
]

function SectionContact() {
  const reveal = useStaggeredReveal()
  const [status, setStatus] = useState<FormStatus>('idle')
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    if (data.get('company')) {
      // honeypot: bot detectado — fingir éxito sin procesar
      setStatus('success')
      return
    }
    setStatus('loading')
    const payload = Object.fromEntries(data.entries())
    // v1: sin backend. F7 conecta Supabase + notificación email.
    window.setTimeout(() => {
      console.log('[lead:v1-no-backend]', payload)
      setStatus('success')
    }, 800)
  }
  return (
    <section
      id="contact"
      ref={(el) => {
        reveal.containerRef.current = el
      }}
      className="min-h-[70vh] w-full flex flex-col pt-1.5 md:pt-2 px-3 md:px-5 pb-3 gap-1.5 md:gap-2"
    >
      <div
        className="bg-stone-50 rounded-xl md:rounded-2xl p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
        style={reveal.getAnimStyle(0)}
      >
        <div className="flex flex-col justify-between gap-6">
          <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] font-bold leading-[0.95] text-black">
            Stop leaving
            <br />
            money on
            <br />
            the table
          </h2>
          <p className="text-sm md:text-base font-semibold text-black max-w-md">
            Get a free consultation and find out how much revenue we can recover for your practice.
          </p>
        </div>
        {status === 'success' ? (
          <div className="flex flex-col items-start justify-center gap-4">
            <h3 className="text-2xl md:text-4xl font-bold text-black leading-tight">
              Request received.
            </h3>
            <p className="text-sm font-semibold text-black">
              We&apos;ll reach out shortly to schedule your free consultation.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {formFields.map((f) => (
              <div key={f.id} className="flex flex-col gap-1">
                <label htmlFor={f.id} className="text-xs font-semibold text-black">
                  {f.label}
                </label>
                <input
                  id={f.id}
                  name={f.id}
                  type={f.type}
                  required
                  placeholder={f.placeholder}
                  className="bg-white rounded-xl border border-neutral-200 px-4 py-3 text-sm text-black focus:outline-none focus:border-teal-600"
                />
              </div>
            ))}
            {/* honeypot */}
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="mt-2 w-full px-6 py-4 bg-teal-600 rounded-full text-white text-sm md:text-base font-bold hover:bg-teal-700 hover:scale-[1.02] transition-all disabled:opacity-60 disabled:hover:scale-100"
            >
              {status === 'loading' ? 'Sending…' : 'Schedule My Free Consultation'}
            </button>
            {status === 'error' && (
              <p className="text-xs font-semibold text-red-600">Something went wrong. Please try again.</p>
            )}
          </form>
        )}
      </div>

      {/* FOOTER */}
      <footer className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-2 md:px-4 py-4" style={reveal.getAnimStyle(1)}>
        <div className="flex flex-col">
          <span className="text-lg font-extrabold uppercase tracking-tight leading-none text-black">MBL Solutions</span>
          <span className="text-[9px] font-medium text-black mt-1">
            © 2026 MBL Solutions Group LLC. All rights reserved.
          </span>
        </div>
        <nav className="flex gap-5 text-xs font-semibold text-black">
          {/* TODO F8: rutas legales reales (draft pending legal review) */}
          <a href="#" className="hover:text-teal-600 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-teal-600 transition-colors">Terms &amp; Conditions</a>
          <a href="#" className="hover:text-teal-600 transition-colors">HIPAA Notice</a>
        </nav>
      </footer>
    </section>
  )
}

// ============================================================
// APP
// ============================================================
export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  return (
    <div className="bg-white">
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <Navbar />
      <SectionHero />
      <SectionServices />
      <SectionWhyMbl />
      <SectionContact />
    </div>
  )
}
