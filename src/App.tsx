import { useState, useEffect } from 'react'
import logoImg from './assets/logo.png'

/* ─── Section IDs & Types ─── */
const SECTIONS = ['hero', 'problem', 'about', 'principles', 'process', 'products'] as const
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
  const items = ['HOME', 'PROBLEM', 'ABOUT', 'PRINCIPLES', 'PROCESS', 'PRODUCTS']
  const ids: SectionId[] = ['hero', 'problem', 'about', 'principles', 'process', 'products']

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

/* ─── Section Title Component ─── */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontWeight: 800,
        fontSize: 'var(--font-section-title)',
        letterSpacing: '0.02em',
        lineHeight: 'var(--lh-heading)',
        color: 'var(--black)',
        margin: 0,
      }}
    >
      {children}
    </h2>
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
          aspectRatio: '3/4',
          maxHeight: '82vh',
          background: 'var(--gray-light)',
          overflow: 'hidden',
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&h=900&fit=crop&auto=format"
          alt="CODEN notebook system flat lay"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>

      {/* Hero Copy */}
      <div
        style={{
          padding: 'clamp(80px, 18vw, 110px) var(--pad-x) clamp(72px, 16vw, 96px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 100,
        }}
      >
        <h1
          style={{
            fontWeight: 800,
            fontSize: 'var(--font-hero)',
            letterSpacing: '0.02em',
            lineHeight: 'var(--lh-heading)',
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
        <p
          style={{
            fontWeight: 500,
            fontSize: 'var(--font-body)',
            letterSpacing: '0.01em',
            lineHeight: 'var(--lh-body)',
            color: 'var(--black)',
            margin: 0,
          }}
        >
          기록하고. 연결하고. 확장하다.
          <br />
          CODEN은 일상의 생각을 의미 있는 아이디어로 바꿉니다.
        </p>
      </div>
    </section>
  )
}

/* ─── Problem Section ─── */
function Problem() {
  const cycle = ['기록', '축적', '분산', '망각', '재기록']

  return (
    <section
      id="problem"
      style={{
        background: 'var(--white)',
        color: 'var(--black)',
        paddingTop: 'clamp(72px, 16vw, 96px)',
        paddingBottom: 'clamp(72px, 16vw, 96px)',
        paddingLeft: 'var(--pad-x)',
        paddingRight: 'var(--pad-x)',
        textAlign: 'center',
      }}
    >
      <div style={{ marginBottom: 72 }}>
        <SectionTitle>Problem</SectionTitle>
      </div>

      {/* Intro Question / Statement */}
      <p
        style={{
          fontWeight: 700,
          fontSize: 'var(--font-subheading)',
          color: 'var(--black)',
          letterSpacing: '0.01em',
          lineHeight: 'var(--lh-heading)',
          marginBottom: 84,
        }}
      >
        기록은 많아졌지만,
        <br />
        다시 보지는 않습니다.
      </p>

      {/* Vertical Steps with Arrows */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 84,
        }}
      >
        {cycle.map((step, i) => (
          <div
            key={step}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Step Word */}
            <p
              style={{
                fontWeight: 800,
                fontSize: 'var(--font-subheading)',
                letterSpacing: '0.06em',
                lineHeight: 'var(--lh-heading)',
                color: i === cycle.length - 1 ? 'var(--blue)' : 'var(--black)',
                margin: 0,
                padding: '12px 0',
              }}
            >
              {step}
            </p>

            {/* Downward Arrow */}
            {i < cycle.length - 1 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '48px 0',
                }}
              >
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

      {/* Concluding Insight */}
      <div
        style={{
          marginTop: 72,
        }}
      >
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
          기록은 남기는 것보다
          <br />
          다시 발견하는 것이 중요합니다.
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
      <div style={{ padding: '0 var(--pad-x)', marginBottom: 96, textAlign: 'center' }}>
        <SectionTitle>Product</SectionTitle>
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

        <div style={{ padding: '48px var(--pad-x) 0', textAlign: 'center' }}>
          <p
            style={{
              fontSize: 'var(--font-body)',
              color: 'var(--gray-text)',
              fontWeight: 500,
              letterSpacing: '0.01em',
              lineHeight: 'var(--lh-body)',
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
        paddingTop: 'clamp(72px, 16vw, 96px)',
        paddingBottom: 'clamp(72px, 16vw, 96px)',
        paddingLeft: 'var(--pad-x)',
        paddingRight: 'var(--pad-x)',
        textAlign: 'center',
      }}
    >
      <div style={{ marginBottom: 72 }}>
        <SectionTitle>About CODEN</SectionTitle>
      </div>

      <p
        style={{
          fontWeight: 800,
          fontSize: 'var(--font-subheading)',
          letterSpacing: '0.01em',
          lineHeight: 'var(--lh-heading)',
          color: 'var(--blue)',
          marginBottom: 72,
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

      <div>
        <div style={{ marginBottom: 72 }}>
          <p
            style={{
              fontWeight: 800,
              fontSize: 'var(--font-subheading)',
              letterSpacing: '0.04em',
              lineHeight: 'var(--lh-heading)',
              color: 'var(--black)',
              marginBottom: 16,
            }}
          >
            CODE
          </p>
          <p
            style={{
              fontSize: 'var(--font-body)',
              color: 'var(--gray-text)',
              letterSpacing: '0.01em',
              lineHeight: 'var(--lh-body)',
            }}
          >
            생각과 기록을 일정한 방식으로 구조화하는 방법
          </p>
        </div>

        <div style={{ marginBottom: 72 }}>
          <p
            style={{
              fontWeight: 800,
              fontSize: 'var(--font-subheading)',
              letterSpacing: '0.04em',
              lineHeight: 'var(--lh-heading)',
              color: 'var(--black)',
              marginBottom: 16,
            }}
          >
            NOTE
          </p>
          <p
            style={{
              fontSize: 'var(--font-body)',
              color: 'var(--gray-text)',
              letterSpacing: '0.01em',
              lineHeight: 'var(--lh-body)',
            }}
          >
            생각과 정보를 기록하는 행위
          </p>
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
          CODEN은 기록을 구조화하는 CODE와 생각을 남기는 NOTE를 결합한 아날로그 메모 시스템입니다.
        </p>
      </div>
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
        paddingTop: 'clamp(72px, 16vw, 96px)',
        paddingBottom: 'clamp(72px, 16vw, 96px)',
        paddingLeft: 'var(--pad-x)',
        paddingRight: 'var(--pad-x)',
        textAlign: 'center',
      }}
    >
      <div style={{ marginBottom: 100 }}>
        <SectionTitle>Principles</SectionTitle>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 84 }}>
        {principles.map((item) => (
          <div key={item.num}>
            <p
              style={{
                fontWeight: 800,
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
                fontWeight: 800,
                fontSize: 'var(--font-subheading)',
                letterSpacing: '0.01em',
                lineHeight: 'var(--lh-heading)',
                color: 'var(--black)',
                marginBottom: 14,
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
        paddingTop: 'clamp(140px, 32vw, 200px)',
        paddingBottom: 'var(--section-py)',
        paddingLeft: 'var(--pad-x)',
        paddingRight: 'var(--pad-x)',
        textAlign: 'center',
      }}
    >
      <div style={{ marginBottom: 160 }}>
        <SectionTitle>Process</SectionTitle>
      </div>
      {processSteps.map((step, i) => (
        <div key={step.en}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
              paddingBottom: 80,
            }}
          >
            <p
              style={{
                fontWeight: 800,
                fontSize: 'var(--font-subheading)',
                letterSpacing: '0.05em',
                lineHeight: 'var(--lh-heading)',
                color: 'var(--black)',
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
              }}
            >
              {step.ko}
            </p>
          </div>
          {i < processSteps.length - 1 && (
            <div style={{ margin: '80px 0' }}>
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

      <div
        style={{
          marginTop: 210,
        }}
      >
        <p
          style={{
            fontWeight: 700,
            fontSize: 'var(--font-body)',
            color: 'var(--black)',
            letterSpacing: '0.01em',
            lineHeight: 'var(--lh-body)',
            marginBottom: 44,
          }}
        >
          기록을 단순히 저장하는 데 그치지 않고, 포착하고 연결하며 새로운 생각으로 확장하는 과정을 제안합니다.
        </p>
      </div>
    </section>
  )
}

/* ─── Footer Section ─── */
function Footer() {
  return (
    <footer style={{ background: 'var(--blue)', color: 'var(--white)', padding: 'clamp(72px, 18vw, 96px) var(--pad-x) 56px' }}>
      <div style={{ marginBottom: 32 }}>
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
        <Problem />
        <About />
        <Principles />
        <Process />
        <Products />
        <Footer />
      </main>
    </div>
  )
}
