import { useState, useEffect } from 'react'
import logoImg from './assets/logo.png'
import logoBlueImg from './assets/logo-blue.png'
import heroImg from './assets/hero.jpg'

/* ─── Section IDs & Types ─── */
const SECTIONS = ['hero', 'background', 'about', 'principles', 'process', 'products'] as const
type SectionId = (typeof SECTIONS)[number]

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
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
  const items = ['HOME', 'BACKGROUND', 'ABOUT', 'PRINCIPLES', 'PROCESS', 'PRODUCTS']
  const ids: SectionId[] = ['hero', 'background', 'about', 'principles', 'process', 'products']

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
                  if (ids[i] === 'hero') {
                    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 340)
                  } else {
                    setTimeout(() => scrollTo(ids[i]), 340)
                  }
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

/* ─── Section Label Component ─── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontWeight: 700,
        fontSize: '12px',
        letterSpacing: '0.14em',
        color: 'var(--gray-text)',
        textTransform: 'uppercase',
        margin: '0 0 clamp(90px, 22vw, 120px) 0',
      }}
    >
      {children}
    </p>
  )
}

/* ─── Hero Section ─── */
function Hero() {
  return (
    <section
      id="hero"
      style={{
        paddingTop: 'var(--nav-height)',
        background: 'var(--white)',
      }}
    >
      {/* Hero Image */}
      <div
        style={{
          width: '100%',
          aspectRatio: '1024/1450',
          maxHeight: '85vh',
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

        {/* Large CODEN Brand Blue Logo Overlaid at Bottom of Photo */}
        <div
          style={{
            position: 'absolute',
            bottom: 28,
            left: 'var(--pad-x)',
            right: 'var(--pad-x)',
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none',
          }}
        >
          <img
            src={logoBlueImg}
            alt="CODEN"
            style={{
              width: '88%',
              maxWidth: 340,
              minWidth: 240,
              height: 'auto',
              display: 'block',
              objectFit: 'contain',
            }}
          />
        </div>
      </div>

      {/* Hero Copy */}
      <div
        style={{
          padding: '64px var(--pad-x) var(--section-py)',
          display: 'flex',
          flexDirection: 'column',
          gap: 72,
        }}
      >
        <h1
          style={{
            fontWeight: 800,
            fontSize: 'var(--font-hero)',
            letterSpacing: '0.02em',
            lineHeight: 1.55,
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
            gap: 22,
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
              fontWeight: 500,
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

/* ─── Background Section ─── */
function Background() {
  return (
    <section
      id="background"
      style={{
        background: 'var(--white)',
        color: 'var(--black)',
        paddingTop: 'var(--section-py)',
        paddingBottom: 'var(--section-py)',
        paddingLeft: 'var(--pad-x)',
        paddingRight: 'var(--pad-x)',
        textAlign: 'center',
      }}
    >
      <SectionLabel>Background</SectionLabel>

      {/* Main Statement */}
      <p
        style={{
          fontWeight: 700,
          fontSize: '17px',
          color: 'var(--black)',
          letterSpacing: '0.01em',
          lineHeight: 1.65,
          marginBottom: 88,
        }}
      >
        기록은 많아졌지만,
        <br />
        다시 보지는 않습니다.
      </p>

      {/* Detailed Description */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 48, textAlign: 'left' }}>
        <p
          style={{
            fontSize: 'var(--font-body)',
            color: 'var(--gray-text)',
            letterSpacing: '0.01em',
            lineHeight: 1.95,
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
            lineHeight: 1.95,
            margin: 0,
          }}
        >
          CODEN은 이러한 반복에서 벗어나, 기록을 다시 발견하고 활용할 수 있는 방법에 대한 고민에서 시작되었습니다.
        </p>
      </div>
    </section>
  )
}

/* ─── Products Section ─── */
function Products() {
  return (
    <section
      id="products"
      style={{
        paddingTop: 'var(--section-py)',
        paddingBottom: 'var(--section-py)',
        background: '#f0f0ee',
      }}
    >
      <div style={{ padding: '0 var(--pad-x)', textAlign: 'center' }}>
        <SectionLabel>Product</SectionLabel>
      </div>

      {/* Single Integrated Product Photo */}
      <div style={{ width: '100%' }}>
        <div
          style={{
            width: '100%',
            aspectRatio: '3/4',
            maxHeight: '82vh',
            background: 'var(--gray-mid)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1587467512961-120760940315?w=900&h=675&fit=crop&auto=format"
            alt="CODEN Notebook & Bookmark System"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 20,
              left: 'var(--pad-x)',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                background: 'var(--blue)',
                color: 'var(--white)',
                fontWeight: 700,
                fontSize: 'var(--font-caption)',
                letterSpacing: '0.08em',
                lineHeight: 1.2,
                padding: '6px 14px',
              }}
            >
              CODEN SYSTEM
            </span>
          </div>
        </div>

        <div style={{ padding: '88px var(--pad-x) 0', textAlign: 'center' }}>
          <p
            style={{
              fontSize: 'var(--font-body)',
              color: 'var(--gray-text)',
              fontWeight: 500,
              letterSpacing: '0.01em',
              lineHeight: 1.85,
              margin: 0,
            }}
          >
            노트북과 북마크로 완성되는 CODEN 기록 시스템
          </p>
        </div>
      </div>
    </section>
  )
}

/* ─── About Section ─── */
function About() {
  return (
    <section
      id="about"
      style={{
        background: 'var(--white)',
        color: 'var(--black)',
        paddingTop: 'var(--section-py)',
        paddingBottom: 'var(--section-py)',
        paddingLeft: 'var(--pad-x)',
        paddingRight: 'var(--pad-x)',
        textAlign: 'center',
      }}
    >
      <SectionLabel>About CODEN</SectionLabel>

      <p
        style={{
          fontWeight: 800,
          fontSize: '18px',
          letterSpacing: '0.01em',
          lineHeight: 'var(--lh-heading)',
          color: 'var(--blue)',
          marginBottom: 108,
          whiteSpace: 'nowrap',
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
        = CODE + NOTE
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 112, marginBottom: 128 }}>
        <div>
          <p
            style={{
              fontWeight: 800,
              fontSize: 'var(--font-subheading)',
              letterSpacing: '0.04em',
              lineHeight: 'var(--lh-heading)',
              color: 'var(--black)',
              marginBottom: 20,
            }}
          >
            CODE
          </p>
          <p
            style={{
              fontSize: 'var(--font-body)',
              color: 'var(--gray-text)',
              letterSpacing: '0.01em',
              lineHeight: 1.85,
              margin: 0,
            }}
          >
            생각과 기록을 일정한 방식으로 구조화하는 방법
          </p>
        </div>

        <div>
          <p
            style={{
              fontWeight: 800,
              fontSize: 'var(--font-subheading)',
              letterSpacing: '0.04em',
              lineHeight: 'var(--lh-heading)',
              color: 'var(--black)',
              marginBottom: 20,
            }}
          >
            NOTE
          </p>
          <p
            style={{
              fontSize: 'var(--font-body)',
              color: 'var(--gray-text)',
              letterSpacing: '0.01em',
              lineHeight: 1.85,
              margin: 0,
            }}
          >
            생각과 정보를 기록하는 행위
          </p>
        </div>
      </div>

      <p
        style={{
          fontWeight: 700,
          fontSize: 'var(--font-body)',
          color: 'var(--black)',
          letterSpacing: '0.01em',
          lineHeight: 1.85,
          margin: 0,
        }}
      >
        CODEN은 기록을 구조화하는 CODE와 생각을 남기는 NOTE를 결합한 아날로그 메모 시스템입니다.
      </p>
    </section>
  )
}

/* ─── Principles Section ─── */
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
        background: 'var(--white)',
        color: 'var(--black)',
        paddingTop: 'var(--section-py)',
        paddingBottom: 'var(--section-py)',
        paddingLeft: 'var(--pad-x)',
        paddingRight: 'var(--pad-x)',
        textAlign: 'center',
      }}
    >
      <SectionLabel>Principles</SectionLabel>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 112 }}>
        {principles.map((item) => (
          <div key={item.num}>
            <p
              style={{
                fontWeight: 800,
                fontSize: 'var(--font-caption)',
                letterSpacing: '0.08em',
                lineHeight: 1.2,
                color: 'var(--blue)',
                marginBottom: 16,
              }}
            >
              {item.num}
            </p>
            <h3
              style={{
                fontWeight: 800,
                fontSize: 'var(--font-subheading)',
                letterSpacing: '0.01em',
                lineHeight: 'var(--lh-heading)',
                color: 'var(--black)',
                marginBottom: 20,
              }}
            >
              {item.title}
            </h3>
            <p
              style={{
                fontSize: 'var(--font-body)',
                color: 'var(--gray-text)',
                letterSpacing: '0.01em',
                lineHeight: 1.85,
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

/* ─── Process Section ─── */
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
        background: 'var(--white)',
        color: 'var(--black)',
        paddingTop: 'var(--section-py)',
        paddingBottom: 'var(--section-py)',
        paddingLeft: 'var(--pad-x)',
        paddingRight: 'var(--pad-x)',
        textAlign: 'center',
      }}
    >
      <SectionLabel>Process</SectionLabel>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 128 }}>
        {processSteps.map((step, i) => (
          <div key={step.en} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p
              style={{
                fontWeight: 800,
                fontSize: 'var(--font-subheading)',
                letterSpacing: '0.05em',
                lineHeight: 'var(--lh-heading)',
                color: 'var(--black)',
                marginBottom: 20,
              }}
            >
              {step.en}
            </p>
            <p
              style={{
                fontSize: 'var(--font-body)',
                color: 'var(--gray-text)',
                letterSpacing: '0.01em',
                lineHeight: 1.85,
                margin: 0,
              }}
            >
              {step.ko}
            </p>
            {i < processSteps.length - 1 && (
              <div style={{ padding: '40px 0' }}>
                <span
                  style={{
                    color: 'var(--blue)',
                    fontSize: '20px',
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
        }}
      >
        기록을 단순히 저장하는 데 그치지 않고, 포착하고 연결하며 새로운 생각으로 확장하는 과정을 제안합니다.
      </p>
    </section>
  )
}

/* ─── Footer Section ─── */
function Footer() {
  return (
    <footer style={{ background: 'var(--blue)', color: 'var(--white)', padding: 'var(--section-py) var(--pad-x) 48px' }}>
      <div style={{ marginBottom: 40 }}>
        <p
          style={{
            fontWeight: 800,
            fontSize: 'var(--font-subheading)',
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
          paddingTop: 16,
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
        <About />
        <Principles />
        <Process />
        <Products />
        <Footer />
      </main>
    </div>
  )
}
