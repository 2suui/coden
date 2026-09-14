import { useState, useEffect } from 'react'
import logoImg from './assets/logo.png'
import heroImg from './assets/hero.jpg'
import product1Img from './assets/product-1.jpg'
import product2Img from './assets/product-2.jpg'
import product3Img from './assets/product-3.jpg'
import product4Img from './assets/product-4.jpg'

/* ─── Section IDs & Types ─── */
const SECTIONS = ['hero', 'background', 'target', 'about', 'principles', 'process', 'products'] as const
type SectionId = (typeof SECTIONS)[number]

function smoothScrollTo(targetY: number, duration: number = 750) {
  const startY = window.pageYOffset || document.documentElement.scrollTop
  const diff = targetY - startY
  if (Math.abs(diff) < 2) return

  const startTime = performance.now()

  function easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  function step(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const ease = easeInOutCubic(progress)
    window.scrollTo(0, startY + diff * ease)

    if (progress < 1) {
      requestAnimationFrame(step)
    }
  }

  requestAnimationFrame(step)
}

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const navHeight = 56
  const targetY = id === 'hero' 
    ? 0 
    : el.getBoundingClientRect().top + window.pageYOffset - navHeight
  smoothScrollTo(targetY, 750)
}

/* ─── Active Section Spy Hook ─── */
function useActiveSection() {
  const [activeSection, setActiveSection] = useState<SectionId>('hero')

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    SECTIONS.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id)
        },
        { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return activeSection
}

/* ─── Logo ─── */
function Logo() {
  return (
    <img
      src={logoImg}
      alt="CODEN"
      style={{
        height: 20,
        width: 'auto',
        display: 'block',
        objectFit: 'contain',
        userSelect: 'none',
      }}
    />
  )
}

/* ─── Hamburger Icon ─── */
function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div style={{ width: 22, height: 15, position: 'relative', cursor: 'pointer' }}>
      {[0, 6, 12].map((top, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: 0,
            top,
            width: '100%',
            height: 1.5,
            background: 'var(--black)',
            transition: 'opacity 0.2s',
            opacity: open && i === 1 ? 0 : 1,
          }}
        />
      ))}
    </div>
  )
}

/* ─── Nav Header ─── */
function Nav({ onMenuOpen }: { onMenuOpen: () => void }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 430,
        height: 'var(--nav-height)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--pad-x)',
        background: 'var(--white)',
        borderBottom: scrolled ? '1px solid var(--gray-mid)' : '1px solid transparent',
        transition: 'border-color 0.3s',
        zIndex: 100,
      }}
    >
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{ background: 'none', border: 'none', padding: '8px 8px 8px 0', marginLeft: -4, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        aria-label="CODEN Home"
      >
        <Logo />
      </button>
      <button
        onClick={onMenuOpen}
        style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer' }}
        aria-label="Open menu"
      >
        <HamburgerIcon open={false} />
      </button>
    </header>
  )
}

/* ─── Slide-in Menu Panel ─── */
function Menu({
  open,
  onClose,
  activeSection,
}: {
  open: boolean
  onClose: () => void
  activeSection: SectionId
}) {
  const items = ['HOME', 'BACKGROUND', 'TARGET USER', 'ABOUT', 'PRINCIPLES', 'PROCESS', 'PRODUCTS']
  const ids: SectionId[] = ['hero', 'background', 'target', 'about', 'principles', 'process', 'products']

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.35)',
          zIndex: 200,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />
      {/* Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '78%',
          maxWidth: 320,
          background: '#2a2a28',
          zIndex: 201,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.38s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          padding: '0 var(--pad-x) 24px',
        }}
      >
        {/* Close Button */}
        <div
          style={{
            height: 'var(--nav-height)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            flexShrink: 0,
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--white)',
              fontSize: '22px',
              cursor: 'pointer',
              padding: '4px',
              lineHeight: 1,
            }}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Navigation Items */}
        <nav style={{ marginTop: 2 }}>
          {items.map((item, i) => {
            const isActive = activeSection === ids[i]
            return (
              <button
                key={item}
                onClick={() => {
                  onClose()
                  setTimeout(() => scrollTo(ids[i]), 300)
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  padding: '14px 0',
                  borderBottom: i < items.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: '20px',
                    letterSpacing: '0.06em',
                    color: isActive ? 'var(--white)' : 'rgba(255,255,255,0.55)',
                    transition: 'color 0.25s',
                  }}
                >
                  {item}
                </span>
                {isActive && (
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: 'var(--yellow)',
                      flexShrink: 0,
                    }}
                  />
                )}
              </button>
            )
          })}
        </nav>
      </div>
    </>
  )
}

/* ─── Unified Section Label ─── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontWeight: 700,
        fontSize: 'var(--font-caption)',
        letterSpacing: '0.14em',
        color: 'var(--gray-text)',
        textTransform: 'uppercase',
        margin: '0 0 clamp(40px, 8vh, 64px) 0',
        textAlign: 'center',
      }}
    >
      {children}
    </p>
  )
}

/* ─── 1. Hero Section ─── */
function Hero() {
  return (
    <section
      id="hero"
      style={{
        minHeight: '100dvh',
        paddingTop: 'var(--nav-height)',
        background: 'var(--white)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Hero Image */}
      <div
        style={{
          width: '100%',
          aspectRatio: '1024/1450',
          maxHeight: '68vh',
          background: 'var(--gray-light)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <img
          src={heroImg}
          alt="CODEN Notebook on yellow background"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>

      {/* Hero Copy */}
      <div
        style={{
          padding: '24px var(--pad-x) 48px',
          display: 'flex',
          flexDirection: 'column',
          gap: 40,
        }}
      >
        <h1
          style={{
            fontWeight: 800,
            fontSize: 'var(--font-hero)',
            letterSpacing: '0.02em',
            lineHeight: 1.4,
            color: 'var(--black)',
            margin: 0,
          }}
        >
          Capture.
          <br />
          Connect.
          <br />
          Create.
        </h1>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <p
            style={{
              fontWeight: 700,
              fontSize: 'var(--font-body)',
              letterSpacing: '0.01em',
              lineHeight: 'var(--lh-body)',
              color: 'var(--black)',
              margin: 0,
            }}
          >
            기록하고. 연결하고. 확장하다.
          </p>
          <p
            style={{
              fontWeight: 400,
              fontSize: 'var(--font-body)',
              letterSpacing: '0.01em',
              lineHeight: 'var(--lh-body)',
              color: 'var(--gray-text)',
              margin: 0,
            }}
          >
            CODEN은 일상의 생각을 의미 있는 아이디어로 바꿉니다.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ─── 2. Background Section ─── */
function Background() {
  return (
    <section
      id="background"
      style={{
        minHeight: '100dvh',
        background: 'var(--white)',
        color: 'var(--black)',
        paddingTop: 'calc(var(--nav-height) + 24px)',
        paddingBottom: '48px',
        paddingLeft: 'var(--pad-x)',
        paddingRight: 'var(--pad-x)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <SectionLabel>Background</SectionLabel>

      {/* Main Statement */}
      <p
        style={{
          fontWeight: 700,
          fontSize: 'var(--font-title)',
          color: 'var(--black)',
          letterSpacing: '0.01em',
          lineHeight: 1.75,
          marginBottom: 64,
          textAlign: 'center',
        }}
      >
        기록은 많아졌지만,
        <br />
        다시 보지는 않습니다.
      </p>

      {/* Detailed Description */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, textAlign: 'left' }}>
        <p
          style={{
            fontSize: 'var(--font-body)',
            color: 'var(--gray-text)',
            letterSpacing: '0.01em',
            lineHeight: 'var(--lh-body)',
            margin: 0,
          }}
        >
          메모, 캡처, 사진, 링크처럼 기록 방식은 다양해졌지만 기록은 여러 곳에 흩어지고 빠르게 잊힙니다. 다시 읽히지 않은 기록은 생각으로 이어지지 못하고, 결국 같은 내용을 다시 찾거나 반복해 기록하게 됩니다.
        </p>
        <p
          style={{
            fontSize: 'var(--font-body)',
            color: 'var(--gray-text)',
            letterSpacing: '0.01em',
            lineHeight: 'var(--lh-body)',
            margin: 0,
          }}
        >
          CODEN은 이러한 반복에서 벗어나, 기록을 다시 발견하고 활용할 수 있는 방법에 대한 고민에서 시작되었습니다.
        </p>
      </div>
    </section>
  )
}

/* ─── 3. Target User Section ─── */
function TargetUser() {
  const targets = [
    {
      num: '01',
      title: '기록은 많지만 다시 찾지 못하는 사람',
      desc: '메모 앱, 노트, 메시지 등 여러 곳에 기록하지만 필요한 순간 다시 꺼내 활용하기 어려운 사람.',
    },
    {
      num: '02',
      title: '과제·프로젝트·아이디어를 자주 기록하는 사람',
      desc: '대학생이나 사회초년생처럼 일상적으로 생각과 정보를 기록하고 정리해야 하는 사람.',
    },
    {
      num: '03',
      title: '기록을 새로운 생각으로 발전시키고 싶은 사람',
      desc: '단순히 저장하는 데서 끝나지 않고, 기록을 다시 읽고 연결해 아이디어나 행동으로 이어가고 싶은 사람.',
    },
  ]

  return (
    <section
      id="target"
      style={{
        minHeight: '100dvh',
        background: 'var(--white)',
        color: 'var(--black)',
        paddingTop: 'calc(var(--nav-height) + 24px)',
        paddingBottom: '48px',
        paddingLeft: 'var(--pad-x)',
        paddingRight: 'var(--pad-x)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <SectionLabel>Target User</SectionLabel>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 44, textAlign: 'left' }}>
        {targets.map((item) => (
          <div key={item.num}>
            <p
              style={{
                fontWeight: 700,
                fontSize: 'var(--font-caption)',
                letterSpacing: '0.08em',
                lineHeight: 1.2,
                color: 'var(--blue)',
                marginBottom: 10,
              }}
            >
              {item.num}
            </p>
            <h3
              style={{
                fontWeight: 700,
                fontSize: 'var(--font-title)',
                letterSpacing: '0.01em',
                lineHeight: 'var(--lh-heading)',
                color: 'var(--black)',
                marginBottom: 10,
              }}
            >
              {item.title}
            </h3>
            <p
              style={{
                fontSize: 'var(--font-body)',
                color: 'var(--gray-text)',
                letterSpacing: '0.01em',
                lineHeight: 'var(--lh-body)',
                margin: 0,
              }}
            >
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─── 4. About Section ─── */
function About() {
  return (
    <section
      id="about"
      style={{
        minHeight: '100dvh',
        background: 'var(--white)',
        color: 'var(--black)',
        paddingTop: 'calc(var(--nav-height) + 24px)',
        paddingBottom: '48px',
        paddingLeft: 'var(--pad-x)',
        paddingRight: 'var(--pad-x)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <SectionLabel>About CODEN</SectionLabel>

      {/* Main Formula Headline */}
      <p
        style={{
          fontWeight: 700,
          fontSize: 'var(--font-title)',
          letterSpacing: '0.01em',
          lineHeight: 'var(--lh-heading)',
          color: 'var(--blue)',
          marginBottom: 44,
          whiteSpace: 'nowrap',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            background: 'var(--yellow)',
            color: 'var(--blue)',
            padding: '2px 7px',
            borderRadius: 2,
            display: 'inline-block',
            letterSpacing: '0.04em',
            lineHeight: 1.2,
          }}
        >
          CODEN
        </span>{' '}
        = CO + DEN
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 36, textAlign: 'left' }}>
        {/* CO */}
        <div>
          <h3
            style={{
              fontSize: 'var(--font-title)',
              letterSpacing: '0.02em',
              lineHeight: 'var(--lh-heading)',
              marginBottom: 10,
            }}
          >
            <span style={{ fontWeight: 700, color: 'var(--blue)' }}>CO</span>
            <span style={{ fontWeight: 400, color: 'var(--blue)' }}> — Collect + Connect</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p
              style={{
                fontSize: 'var(--font-body)',
                color: 'var(--gray-text)',
                letterSpacing: '0.01em',
                lineHeight: 'var(--lh-body)',
                margin: 0,
              }}
            >
              흩어진 기록을 다시 모으고, 서로 다른 생각을 연결하는 과정을 의미합니다.
            </p>
            <p
              style={{
                fontSize: 'var(--font-body)',
                color: 'var(--gray-text)',
                letterSpacing: '0.01em',
                lineHeight: 'var(--lh-body)',
                margin: 0,
              }}
            >
              한 번 쓰고 끝나는 기록이 아니라, 다시 발견하고 새로운 맥락으로 이어가는 기록 방식을 담았습니다.
            </p>
          </div>
        </div>

        {/* DEN */}
        <div>
          <h3
            style={{
              fontSize: 'var(--font-title)',
              letterSpacing: '0.02em',
              lineHeight: 'var(--lh-heading)',
              marginBottom: 10,
            }}
          >
            <span style={{ fontWeight: 700, color: 'var(--blue)' }}>DEN</span>
            <span style={{ fontWeight: 400, color: 'var(--blue)' }}> — A space for thoughts</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p
              style={{
                fontSize: 'var(--font-body)',
                color: 'var(--gray-text)',
                letterSpacing: '0.01em',
                lineHeight: 'var(--lh-body)',
                margin: 0,
              }}
            >
              기록과 생각이 잠시 머물고, 필요할 때 다시 꺼내어 이어갈 수 있는 공간을 의미합니다.
            </p>
            <p
              style={{
                fontSize: 'var(--font-body)',
                color: 'var(--gray-text)',
                letterSpacing: '0.01em',
                lineHeight: 'var(--lh-body)',
                margin: 0,
              }}
            >
              모인 기록은 이곳에서 다시 발견되고, 다른 생각과 연결되며 새로운 아이디어로 확장됩니다.
            </p>
          </div>
        </div>

        {/* Open Loop */}
        <div>
          <h3
            style={{
              fontWeight: 700,
              fontSize: 'var(--font-title)',
              letterSpacing: '0.02em',
              lineHeight: 'var(--lh-heading)',
              color: 'var(--blue)',
              marginBottom: 10,
            }}
          >
            Open Loop
          </h3>
          <p
            style={{
              fontSize: 'var(--font-body)',
              color: 'var(--gray-text)',
              letterSpacing: '0.01em',
              lineHeight: 'var(--lh-body)',
              margin: 0,
            }}
          >
            CODEN의 열린 O는 완전히 닫히지 않은 형태로, 기록이 하나의 끝에 머무르지 않고 다음 생각으로 계속 이어지는 Open Loop를 상징합니다.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ─── 5. Principles Section ─── */
function Principles() {
  const principles = [
    {
      num: '01',
      title: '하나의 생각, 하나의 메모',
      desc: '한 메모에는 하나의 생각만 남깁니다.',
    },
    {
      num: '02',
      title: '처음부터 정리하지 않습니다',
      desc: '떠오른 생각은 먼저 붙잡고, 정리는 나중에 합니다.',
    },
    {
      num: '03',
      title: '다시 보는 것을 전제로 기록합니다',
      desc: '기록은 쌓는 것이 아니라 다시 발견하기 위한 것입니다.',
    },
    {
      num: '04',
      title: '기록은 다음 행동으로 이어집니다',
      desc: '남겨진 생각을 연결해 새로운 생각과 행동으로 발전시킵니다.',
    },
  ]

  return (
    <section
      id="principles"
      style={{
        minHeight: '100dvh',
        background: 'var(--white)',
        color: 'var(--black)',
        paddingTop: 'calc(var(--nav-height) + 24px)',
        paddingBottom: '48px',
        paddingLeft: 'var(--pad-x)',
        paddingRight: 'var(--pad-x)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <SectionLabel>Principles</SectionLabel>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, textAlign: 'left' }}>
        {principles.map((item) => (
          <div key={item.num}>
            <p
              style={{
                fontWeight: 700,
                fontSize: 'var(--font-caption)',
                letterSpacing: '0.08em',
                lineHeight: 1.2,
                color: 'var(--blue)',
                marginBottom: 6,
              }}
            >
              {item.num}
            </p>
            <h3
              style={{
                fontWeight: 700,
                fontSize: 'var(--font-title)',
                letterSpacing: '0.01em',
                lineHeight: 'var(--lh-heading)',
                color: 'var(--black)',
                marginBottom: 6,
              }}
            >
              {item.title}
            </h3>
            <p
              style={{
                fontSize: 'var(--font-body)',
                color: 'var(--gray-text)',
                letterSpacing: '0.01em',
                lineHeight: 'var(--lh-body)',
                margin: 0,
              }}
            >
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─── 6. Process Section ─── */
function Process() {
  const processSteps = [
    { en: 'CAPTURE', ko: '생각과 정보를 기록하고' },
    { en: 'CONNECT', ko: '서로 연결하고' },
    { en: 'CREATE', ko: '새로운 생각으로 확장합니다.' },
  ]

  return (
    <section
      id="process"
      style={{
        minHeight: '100dvh',
        background: 'var(--white)',
        color: 'var(--black)',
        paddingTop: 'calc(var(--nav-height) + 24px)',
        paddingBottom: '48px',
        paddingLeft: 'var(--pad-x)',
        paddingRight: 'var(--pad-x)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <SectionLabel>Process</SectionLabel>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 48 }}>
        {processSteps.map((step, i) => (
          <div key={step.en} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p
              style={{
                fontWeight: 700,
                fontSize: 'var(--font-title)',
                letterSpacing: '0.05em',
                lineHeight: 'var(--lh-heading)',
                color: 'var(--black)',
                marginBottom: 10,
              }}
            >
              {step.en}
            </p>
            <p
              style={{
                fontSize: 'var(--font-body)',
                color: 'var(--gray-text)',
                letterSpacing: '0.01em',
                lineHeight: 'var(--lh-body)',
                margin: 0,
              }}
            >
              {step.ko}
            </p>
            {i < processSteps.length - 1 && (
              <div style={{ padding: '20px 0' }}>
                <span
                  style={{
                    color: 'var(--blue)',
                    fontSize: '18px',
                    lineHeight: 1,
                    display: 'block',
                  }}
                >
                  ↓
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <p
        style={{
          fontWeight: 700,
          fontSize: 'var(--font-body)',
          color: 'var(--black)',
          letterSpacing: '0.01em',
          lineHeight: 'var(--lh-body)',
          margin: 0,
          textAlign: 'center',
        }}
      >
        기록을 단순히 저장하는 데 그치지 않고, 포착하고 연결하며 새로운 생각으로 확장하는 과정을 제안합니다.
      </p>
    </section>
  )
}

/* ─── 7. Products Section ─── */
function Products() {
  return (
    <section
      id="products"
      style={{
        minHeight: '100dvh',
        paddingTop: 'calc(var(--nav-height) + 32px)',
        paddingBottom: '64px',
        background: '#f0f0ee',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <div style={{ padding: '0 var(--pad-x)', textAlign: 'center' }}>
        <SectionLabel>Product</SectionLabel>
      </div>

      {/* Product Photos */}
      <div style={{ width: '100%' }}>
        {/* First Standalone Photo */}
        <div
          style={{
            width: '100%',
            background: 'var(--gray-mid)',
            overflow: 'hidden',
            marginBottom: 32,
          }}
        >
          <img
            src={product1Img}
            alt="CODEN Desk Notebook & Bookmark Cards"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>

        {/* 3 Attached Photos with 0 Gap */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, width: '100%' }}>
          {[
            { src: product2Img, alt: 'CODEN Notebook Open & Closed Flat Lay' },
            { src: product3Img, alt: 'CODEN Notebook Open Page Vertical View' },
            { src: product4Img, alt: 'CODEN Notebook Dot Grid and Bookmark Close-Up' },
          ].map((img, i) => (
            <div
              key={i}
              style={{
                width: '100%',
                background: 'var(--gray-mid)',
                overflow: 'hidden',
                lineHeight: 0,
              }}
            >
              <img
                src={img.src}
                alt={img.alt}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '48px var(--pad-x) 0', textAlign: 'center' }}>
        <p
          style={{
            fontSize: 'var(--font-body)',
            color: 'var(--gray-text)',
            fontWeight: 400,
            letterSpacing: '0.01em',
            lineHeight: 'var(--lh-body)',
            margin: 0,
          }}
        >
          노트북과 북마크로 완성되는 CODEN 기록 시스템
        </p>
      </div>
    </section>
  )
}

/* ─── 8. Footer Section ─── */
function Footer() {
  return (
    <footer style={{ background: 'var(--blue)', color: 'var(--white)', padding: '64px var(--pad-x) 48px', minHeight: '50dvh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ paddingBottom: 28, marginBottom: 28, borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
        <p
          style={{
            fontWeight: 700,
            fontSize: 'var(--font-title)',
            letterSpacing: '0.06em',
            lineHeight: 'var(--lh-heading)',
            color: 'var(--white)',
            marginBottom: 8,
          }}
        >
          CODEN
        </p>
        <p
          style={{
            fontWeight: 300,
            fontSize: 'var(--font-caption)',
            color: 'rgba(255,255,255,0.85)',
            letterSpacing: '0.02em',
            lineHeight: 1.3,
            margin: 0,
          }}
        >
          Capture. Connect. Create.
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <div>
          <p
            style={{
              fontSize: 'var(--font-caption)',
              color: 'rgba(255,255,255,0.75)',
              letterSpacing: '0.02em',
              lineHeight: 'var(--lh-body)',
              margin: 0,
            }}
          >
            Designed by Suyeon
            <br />
            Email 2suuui@naver.com
          </p>
        </div>
        <p
          style={{
            fontSize: '12px',
            letterSpacing: '0.04em',
            color: 'rgba(255,255,255,0.65)',
            lineHeight: 'var(--lh-body)',
            margin: 0,
          }}
        >
          © 2026 CODEN.
        </p>
      </div>
    </footer>
  )
}

/* ─── App Root Component ─── */
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const activeSection = useActiveSection()

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <div style={{ maxWidth: 430, minWidth: 320, margin: '0 auto', position: 'relative' }}>
      <Nav onMenuOpen={() => setMenuOpen(true)} />
      <Menu open={menuOpen} onClose={() => setMenuOpen(false)} activeSection={activeSection} />

      <main>
        <Hero />
        <Background />
        <TargetUser />
        <About />
        <Principles />
        <Process />
        <Products />
        <Footer />
      </main>
    </div>
  )
}
