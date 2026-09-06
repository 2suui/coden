import { useState, useEffect, useRef } from 'react'
import logoImg from './assets/logo.png'

/* ─── Section IDs & Types ─── */
const SECTIONS = ['hero', 'problem', 'about', 'process', 'products', 'details'] as const
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
  const items = ['HOME', 'PROBLEM', 'ABOUT', 'PROCESS', 'PRODUCTS', 'DETAILS']
  const ids: SectionId[] = ['hero', 'problem', 'about', 'process', 'products', 'details']

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

/* ─── Section Label ─── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontWeight: 700,
        fontSize: '12px',
        letterSpacing: '0.14em',
        color: 'var(--gray-text)',
        textTransform: 'uppercase',
        marginBottom: 0,
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
          padding: 'clamp(72px, 16vw, 100px) var(--pad-x) clamp(130px, 28vw, 190px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 110,
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
        <p
          style={{
            fontWeight: 500,
            fontSize: 'var(--font-body)',
            letterSpacing: '0.01em',
            lineHeight: 2.35,
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
        paddingTop: 'var(--section-py)',
        paddingBottom: 'var(--section-py)',
        paddingLeft: 'var(--pad-x)',
        paddingRight: 'var(--pad-x)',
        textAlign: 'center',
      }}
    >
      <p
        style={{
          fontWeight: 700,
          fontSize: '12px',
          letterSpacing: '0.14em',
          color: 'var(--gray-text)',
          textTransform: 'uppercase',
          marginBottom: 120,
        }}
      >
        Problem
      </p>

      {/* Intro Question / Statement */}
      <p
        style={{
          fontWeight: 700,
          fontSize: 'var(--font-body)',
          color: 'var(--black)',
          letterSpacing: '0.01em',
          lineHeight: 2.25,
          marginBottom: 120,
        }}
      >
        기록은 많아졌지만,
        <br />
        다시 보지는 않습니다.
      </p>

      {/* Vertical Steps with Arrows and Generous Spacing */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 130,
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
            {/* Step Word (No outer circle / container, pure typography) */}
            <p
              style={{
                fontWeight: 800,
                fontSize: '17px',
                letterSpacing: '0.08em',
                color: i === cycle.length - 1 ? 'var(--blue)' : 'var(--black)',
                margin: 0,
                padding: '12px 0',
              }}
            >
              {step}
            </p>

            {/* Downward Arrow with Generous Spacing */}
            {i < cycle.length - 1 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '56px 0',
                }}
              >
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

      {/* Concluding Insight (Matching About section typography) */}
      <div
        style={{
          marginTop: 110,
        }}
      >
        <p
          style={{
            fontWeight: 700,
            fontSize: 'var(--font-body)',
            color: 'var(--black)',
            letterSpacing: '0.01em',
            lineHeight: 2.3,
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
      <div style={{ padding: '0 var(--pad-x)', marginBottom: 64, textAlign: 'center' }}>
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
                fontSize: '12.5px',
                letterSpacing: '0.08em',
                padding: '6px 14px',
              }}
            >
              CODEN SYSTEM
            </span>
          </div>
        </div>

        <div style={{ padding: '36px var(--pad-x) 0', textAlign: 'center' }}>
          <p
            style={{
              fontSize: 'var(--font-body)',
              color: 'var(--gray-text)',
              fontWeight: 500,
              letterSpacing: '0.01em',
              lineHeight: 2.1,
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
  const processSteps = [
    { en: 'COLLECT', ko: '정보를 수집하고' },
    { en: 'CONNECT', ko: '서로 연결하고' },
    { en: 'DISTILL', ko: '핵심을 추리고' },
    { en: 'REFLECT', ko: '자신의 생각으로 정리합니다.' },
  ]

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
      <p
        style={{
          fontWeight: 700,
          fontSize: '12px',
          letterSpacing: '0.14em',
          color: 'var(--gray-text)',
          textTransform: 'uppercase',
          marginBottom: 130,
        }}
      >
        About CODEN
      </p>

      <p
        style={{
          fontWeight: 800,
          fontSize: 'clamp(18px, 4.8vw, 22px)',
          letterSpacing: '0.01em',
          color: 'var(--blue)',
          marginBottom: 120,
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

      <div style={{ marginBottom: 96 }}>
        <div style={{ marginBottom: 96 }}>
          <p
            style={{
              fontWeight: 800,
              fontSize: '16px',
              letterSpacing: '0.05em',
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
              lineHeight: 2.2,
            }}
          >
            생각과 기록을 일정한 방식으로 구조화하는 방법
          </p>
        </div>

        <div style={{ marginBottom: 88 }}>
          <p
            style={{
              fontWeight: 800,
              fontSize: '16px',
              letterSpacing: '0.05em',
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
              lineHeight: 2.2,
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
            lineHeight: 2.3,
          }}
        >
          CODEN은 기록을 구조화하는 CODE와 생각을 남기는 NOTE를 결합한 아날로그 메모 시스템입니다.
        </p>
      </div>

      <div id="process" style={{ scrollMarginTop: 'var(--nav-height)' }}>
        <p
          style={{
            fontWeight: 700,
            fontSize: '12px',
            letterSpacing: '0.14em',
            color: 'var(--gray-text)',
            textTransform: 'uppercase',
            marginBottom: 96,
          }}
        >
          Process
        </p>
        {processSteps.map((step, i) => (
          <div key={step.en}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                paddingBottom: 48,
              }}
            >
              <p
                style={{
                  fontWeight: 800,
                  fontSize: '16px',
                  letterSpacing: '0.05em',
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
                  lineHeight: 2.0,
                }}
              >
                {step.ko}
              </p>
            </div>
            {i < processSteps.length - 1 && (
              <div style={{ margin: '48px 0' }}>
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

      <div
        style={{
          marginTop: 120,
        }}
      >
        <p
          style={{
            fontWeight: 700,
            fontSize: 'var(--font-body)',
            color: 'var(--black)',
            letterSpacing: '0.01em',
            lineHeight: 2.35,
            marginBottom: 44,
          }}
        >
          또한 Collect와 Connect의 공통된 시작인 CO에는 생각과 정보를 모으고, 서로 연결해 새로운 의미를 발견한다는 CODEN의 핵심 과정이 담겨 있습니다.
        </p>
        <p
          style={{
            fontWeight: 700,
            fontSize: 'var(--font-body)',
            color: 'var(--black)',
            letterSpacing: '0.01em',
            lineHeight: 2.35,
          }}
        >
          기록을 단순히 저장하는 데 그치지 않고, 수집하고 연결하며 핵심을 추려 자신의 생각으로 다시 정리하고 확장하는 과정을 제안합니다.
        </p>
      </div>
    </section>
  )
}

/* ─── Product Details Section ─── */
function ProductDetails() {
  const [active, setActive] = useState<string>('NOTEBOOK')
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  const products = {
    NOTEBOOK: {
      label: 'NOTEBOOK',
      description: (
        <>
          흩어진 생각을 구조로 바꾸는 노트.
          <br />
          기록에서 연결과 확장으로 이어지는 CODEN의 핵심 도구입니다.
        </>
      ),
      img: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=700&h=900&fit=crop&auto=format',
      alt: 'CODEN notebook spread showing inner pages',
      specs: ['커버 — 하드커버', '내지 — 도트 그리드', '크기 — A5 (148×210mm)', '매수 — 192p'],
    },
    PACKAGE: {
      label: 'PACKAGE',
      description: (
        <>
          기록부터 연결까지, 노트북·펜·북마크로 구성된
          <br />
          CODEN의 완전한 기록 시스템입니다.
        </>
      ),
      img: 'https://images.unsplash.com/photo-1587467512961-120760940315?w=700&h=900&fit=crop&auto=format',
      alt: 'CODEN complete product package',
      specs: ['구성 — 노트북 + 펜 + 북마크', '패키지 — 박스 포장', '크기 — 160×225mm', '소재 — 재생지'],
    },
    BOOKMARK: {
      label: 'BOOKMARK',
      description: (
        <>
          페이지를 정확하게 표시하고,
          <br />
          기록의 위치를 직관적으로 이어줍니다.
        </>
      ),
      img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=700&h=900&fit=crop&auto=format',
      alt: 'CODEN magnetic bookmark in use',
      specs: ['방식 — 자석 클립', '소재 — 황동', '크기 — 20×80mm', '색상 — 블루 / 옐로우'],
    },
  }

  const productKeys = Object.keys(products)
  const currentIndex = productKeys.indexOf(active)
  const current = products[active as keyof typeof products]

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % productKeys.length
    setActive(productKeys[nextIdx])
  }

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + productKeys.length) % productKeys.length
    setActive(productKeys[prevIdx])
  }

  /* ─── Touch & Mouse Swipe Handlers ─── */
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    }
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y
    touchStartRef.current = null

    if (Math.abs(dx) > 36 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      if (dx < 0) {
        handleNext()
      } else {
        handlePrev()
      }
    }
  }

  const onMouseDown = (e: React.MouseEvent) => {
    touchStartRef.current = { x: e.clientX, y: e.clientY }
  }

  const onMouseUp = (e: React.MouseEvent) => {
    if (!touchStartRef.current) return
    const dx = e.clientX - touchStartRef.current.x
    const dy = e.clientY - touchStartRef.current.y
    touchStartRef.current = null

    if (Math.abs(dx) > 36 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      if (dx < 0) {
        handleNext()
      } else {
        handlePrev()
      }
    }
  }

  return (
    <section id="details" style={{ background: 'var(--white)', paddingTop: 'var(--section-py)' }}>
      <div style={{ textAlign: 'center', marginBottom: 64, padding: '0 var(--pad-x)' }}>
        <SectionLabel>Product Detail</SectionLabel>
      </div>

      {/* Tab Bar */}
      <div
        style={{
          display: 'flex',
          padding: '0 var(--pad-x)',
          overflowX: 'auto',
          justifyContent: 'center',
          gap: 16,
          marginBottom: 24,
        }}
      >
        {productKeys.map((key) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            style={{
              padding: '10px 16px',
              background: active === key ? 'var(--black)' : 'transparent',
              borderRadius: 20,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '12px',
              letterSpacing: '0.06em',
              color: active === key ? 'var(--white)' : 'var(--gray-text)',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Swipeable Product Content Area */}
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        style={{
          touchAction: 'pan-y',
          cursor: 'grab',
          userSelect: 'none',
        }}
      >
        {/* Product Image */}
        <div
          style={{
            width: '100%',
            aspectRatio: '4/3',
            background: 'var(--gray-light)',
            overflow: 'hidden',
          }}
        >
          <img
            src={current.img}
            alt={current.alt}
            key={current.img}
            draggable={false}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>

        {/* Product Info */}
        <div style={{ padding: '44px var(--pad-x) var(--section-py)' }}>
          <h3
            style={{
              fontWeight: 800,
              fontSize: 'var(--font-title)',
              letterSpacing: '0.04em',
              color: 'var(--black)',
              marginBottom: 20,
            }}
          >
            {current.label}
          </h3>
          <p
            style={{
              fontSize: 'var(--font-body)',
              letterSpacing: '0.01em',
              lineHeight: 2.2,
              color: '#555',
              marginBottom: 36,
            }}
          >
            {current.description}
          </p>
          <div style={{ paddingTop: 20 }}>
            {current.specs.map((spec, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                }}
              >
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--black)',
                    letterSpacing: '0.02em',
                  }}
                >
                  {spec.split('—')[0].trim()}
                </span>
                <span
                  style={{
                    fontSize: '13px',
                    color: 'var(--gray-text)',
                    letterSpacing: '0.01em',
                  }}
                >
                  {spec.split('—')[1]?.trim()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Footer Section ─── */
function Footer() {
  return (
    <footer style={{ background: 'var(--black)', color: 'var(--white)', padding: '48px var(--pad-x) 40px' }}>
      <div style={{ marginBottom: 32 }}>
        <p
          style={{
            fontWeight: 800,
            fontSize: '16px',
            letterSpacing: '0.06em',
            color: 'rgba(255,255,255,0.7)',
            marginBottom: 8,
          }}
        >
          CODEN
        </p>
        <p
          style={{
            fontWeight: 300,
            fontSize: '12px',
            color: 'rgba(255,255,255,0.55)',
            letterSpacing: '0.02em',
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
              fontSize: '12px',
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: '0.02em',
              lineHeight: 2.0,
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
            color: 'rgba(255,255,255,0.3)',
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
        <Products />
        <ProductDetails />
        <Footer />
      </main>
    </div>
  )
}
