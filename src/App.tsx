import { useState, useEffect, useRef } from 'react'

/* ─── Section IDs & Types ─── */
const SECTIONS = ['hero', 'about', 'products', 'process', 'details', 'design'] as const
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
    <span
      style={{
        fontWeight: 800,
        fontSize: '22px',
        letterSpacing: '0.12em',
        color: 'var(--black)',
        userSelect: 'none',
      }}
    >
      CODEN
    </span>
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
        style={{ background: 'none', border: 'none', padding: '8px 8px 8px 0', cursor: 'pointer' }}
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
  const items = ['HOME', 'ABOUT', 'PRODUCTS', 'HOW TO USE', 'DETAILS', 'DESIGN']
  const ids: SectionId[] = ['hero', 'about', 'products', 'process', 'details', 'design']

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
                    letterSpacing: '0.14em',
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
        fontSize: '10.5px',
        letterSpacing: '0.24em',
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
          padding: 'clamp(56px, 14vw, 84px) var(--pad-x) clamp(96px, 20vw, 140px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 84,
        }}
      >
        <h1
          style={{
            fontWeight: 800,
            fontSize: 'var(--font-hero)',
            letterSpacing: '0.14em',
            lineHeight: 1.45,
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
            letterSpacing: '0.08em',
            lineHeight: 2.1,
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
      <div style={{ padding: '0 var(--pad-x)', marginBottom: 48, textAlign: 'center' }}>
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
                letterSpacing: '0.16em',
                padding: '6px 14px',
              }}
            >
              CODEN SYSTEM
            </span>
          </div>
        </div>

        <div style={{ padding: '24px var(--pad-x) 0', textAlign: 'center' }}>
          <p
            style={{
              fontSize: 'var(--font-body)',
              color: 'var(--gray-text)',
              fontWeight: 500,
              letterSpacing: '0.07em',
              lineHeight: 1.8,
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
          fontSize: '10.5px',
          letterSpacing: '0.24em',
          color: 'var(--gray-text)',
          textTransform: 'uppercase',
          marginBottom: 110,
        }}
      >
        About CODEN
      </p>

      <p
        style={{
          fontWeight: 800,
          fontSize: 'clamp(18px, 5vw, 22px)',
          letterSpacing: '0.12em',
          color: 'var(--blue)',
          marginBottom: 96,
        }}
      >
        <span
          style={{
            background: 'var(--yellow)',
            color: 'var(--blue)',
            padding: '1px 6px',
            borderRadius: 2,
            display: 'inline-block',
            letterSpacing: '0.14em',
            lineHeight: 1.2,
          }}
        >
          CODEN
        </span>{' '}
        = CODE + NOTE
      </p>

      <div style={{ marginBottom: 72 }}>
        <div style={{ marginBottom: 72 }}>
          <p
            style={{
              fontWeight: 800,
              fontSize: '16.5px',
              letterSpacing: '0.18em',
              color: 'var(--black)',
              marginBottom: 14,
            }}
          >
            CODE
          </p>
          <p
            style={{
              fontSize: 'var(--font-body)',
              color: 'var(--gray-text)',
              letterSpacing: '0.07em',
              lineHeight: 1.95,
            }}
          >
            생각과 기록을 일정한 방식으로 구조화하는 방법
          </p>
        </div>

        <div style={{ marginBottom: 64 }}>
          <p
            style={{
              fontWeight: 800,
              fontSize: '16.5px',
              letterSpacing: '0.18em',
              color: 'var(--black)',
              marginBottom: 14,
            }}
          >
            NOTE
          </p>
          <p
            style={{
              fontSize: 'var(--font-body)',
              color: 'var(--gray-text)',
              letterSpacing: '0.07em',
              lineHeight: 1.95,
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
            letterSpacing: '0.08em',
            lineHeight: 2.05,
          }}
        >
          CODEN은 기록을 구조화하는 CODE와 생각을 남기는 NOTE를 결합한 아날로그 메모 시스템입니다.
        </p>
      </div>

      <div
        style={{
          width: 32,
          height: 2,
          background: 'var(--blue)',
          margin: '0 auto 80px',
        }}
      />

      <div>
        <p
          style={{
            fontWeight: 700,
            fontSize: '10.5px',
            letterSpacing: '0.24em',
            color: 'var(--gray-text)',
            textTransform: 'uppercase',
            marginBottom: 72,
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
                gap: 10,
                paddingBottom: 36,
              }}
            >
              <p
                style={{
                  fontWeight: 800,
                  fontSize: '15.5px',
                  letterSpacing: '0.18em',
                  color: 'var(--black)',
                }}
              >
                {step.en}
              </p>
              <p
                style={{
                  fontSize: 'var(--font-body)',
                  color: 'var(--gray-text)',
                  letterSpacing: '0.08em',
                  lineHeight: 1.8,
                }}
              >
                {step.ko}
              </p>
            </div>
            {i < processSteps.length - 1 && (
              <div style={{ marginBottom: 12 }}>
                <span
                  style={{
                    color: 'var(--blue)',
                    fontSize: '18px',
                    lineHeight: 1,
                    display: 'block',
                    marginBottom: 36,
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
          marginTop: 80,
          paddingTop: 80,
          borderTop: '1px solid rgba(0,0,0,0.08)',
        }}
      >
        <p
          style={{
            fontWeight: 700,
            fontSize: 'var(--font-body)',
            color: 'var(--black)',
            letterSpacing: '0.08em',
            lineHeight: 2.15,
            marginBottom: 32,
          }}
        >
          또한 Collect와 Connect의 공통된 시작인 CO에는 생각과 정보를 모으고, 서로 연결해 새로운 의미를 발견한다는 CODEN의 핵심 과정이 담겨 있습니다.
        </p>
        <p
          style={{
            fontWeight: 700,
            fontSize: 'var(--font-body)',
            color: 'var(--black)',
            letterSpacing: '0.08em',
            lineHeight: 2.15,
          }}
        >
          기록을 단순히 저장하는 데 그치지 않고, 수집하고 연결하며 핵심을 추려 자신의 생각으로 다시 정리하고 확장하는 과정을 제안합니다.
        </p>
      </div>
    </section>
  )
}

/* ─── How to Use Section ─── */
function Process() {
  const steps: { num: string; title: string; en: string; desc: React.ReactNode }[] = [
    {
      num: '01',
      title: '기록',
      en: 'Capture',
      desc: (
        <>
          먼저, 적습니다.
          <br />
          떠오른 생각을 판단하지 않고 자유롭게 기록합니다.
        </>
      ),
    },
    {
      num: '02',
      title: '선별',
      en: 'Select',
      desc: (
        <>
          남길 생각을 골라냅니다.
          <br />
          쌓인 기록 속에서 지금 의미 있는 생각을 찾아냅니다.
        </>
      ),
    },
    {
      num: '03',
      title: '연결',
      en: 'Connect',
      desc: (
        <>
          생각과 생각을 이어봅니다.
          <br />
          서로 다른 기록 사이의 관계를 발견하고
          <br />
          새로운 맥락을 만듭니다.
        </>
      ),
    },
    {
      num: '04',
      title: '재발견',
      en: 'Rediscover',
      desc: (
        <>
          기록을 다시 꺼내 바라봅니다.
          <br />
          지나간 생각을 현재의 시선으로 다시 읽으며
          <br />
          새로운 의미를 발견합니다.
        </>
      ),
    },
    {
      num: '05',
      title: '확장',
      en: 'Expand',
      desc: (
        <>
          발견한 생각을 다음으로 확장합니다.
          <br />
          하나의 기록은 새로운 아이디어가 되고,
          <br />
          또 다른 생각의 시작점으로 이어집니다.
        </>
      ),
    },
  ]

  return (
    <section
      id="process"
      style={{
        background: 'var(--white)',
        paddingTop: 'var(--section-py)',
        paddingBottom: 'var(--section-py)',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 48, padding: '0 var(--pad-x)' }}>
        <SectionLabel>How to Use</SectionLabel>
      </div>

      <div>
        {steps.map((step, i) => (
          <div
            key={step.num}
            style={{
              padding: '28px var(--pad-x)',
              borderTop: i === 0 ? '1px solid var(--gray-mid)' : 'none',
              borderBottom: '1px solid var(--gray-mid)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: 'var(--font-badge-num)',
                  letterSpacing: '0.14em',
                  color: 'var(--yellow)',
                  background: 'var(--black)',
                  padding: '2px 7px',
                  lineHeight: 1.5,
                  flexShrink: 0,
                  marginTop: 4,
                }}
              >
                {step.num}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 10 }}>
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: 'var(--font-how-title)',
                      letterSpacing: '0.14em',
                      color: 'var(--black)',
                    }}
                  >
                    {step.title}
                  </span>
                  <span
                    style={{
                      fontWeight: 400,
                      fontSize: '11.5px',
                      letterSpacing: '0.16em',
                      color: 'var(--gray-text)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {step.en}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 'var(--font-body)',
                    letterSpacing: '0.07em',
                    lineHeight: 1.9,
                    color: '#444',
                    margin: 0,
                  }}
                >
                  {step.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
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
      <div style={{ textAlign: 'center', marginBottom: 48, padding: '0 var(--pad-x)' }}>
        <SectionLabel>Product Detail</SectionLabel>
      </div>

      {/* Tab Bar */}
      <div
        style={{
          display: 'flex',
          borderTop: '1px solid var(--gray-mid)',
          borderBottom: '1px solid var(--gray-mid)',
          padding: '0 var(--pad-x)',
          overflowX: 'auto',
        }}
      >
        {productKeys.map((key) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            style={{
              flex: 1,
              minWidth: 80,
              padding: '14px 12px',
              background: 'none',
              border: 'none',
              borderBottom: active === key ? '2px solid var(--blue)' : '2px solid transparent',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '12px',
              letterSpacing: '0.14em',
              color: active === key ? 'var(--blue)' : 'var(--gray-text)',
              transition: 'color 0.2s, border-color 0.2s',
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
        <div style={{ padding: '32px var(--pad-x) var(--section-py)' }}>
          <h3
            style={{
              fontWeight: 800,
              fontSize: 'var(--font-title)',
              letterSpacing: '0.14em',
              color: 'var(--black)',
              marginBottom: 12,
            }}
          >
            {current.label}
          </h3>
          <p
            style={{
              fontSize: 'var(--font-body)',
              letterSpacing: '0.07em',
              lineHeight: 1.9,
              color: '#555',
              marginBottom: 28,
            }}
          >
            {current.description}
          </p>
          <div style={{ borderTop: '1px solid var(--gray-mid)', paddingTop: 20 }}>
            {current.specs.map((spec, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: i < current.specs.length - 1 ? '1px solid var(--gray-mid)' : 'none',
                }}
              >
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--black)',
                    letterSpacing: '0.08em',
                  }}
                >
                  {spec.split('—')[0].trim()}
                </span>
                <span
                  style={{
                    fontSize: '13px',
                    color: 'var(--gray-text)',
                    letterSpacing: '0.06em',
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

/* ─── Design Philosophy Section ─── */
function Design() {
  const pillars = [
    { label: 'Logo', desc: '단순하고 명확한 레터마크. CODE와 NOTE의 결합을 표현합니다.' },
    { label: 'Color', desc: '블루 — 구조와 신뢰. 옐로우 — 아이디어와 연결의 순간.' },
    { label: 'Typography', desc: '명확한 위계를 위한 서체 시스템. 읽기 위한 디자인.' },
    { label: 'Graphic System', desc: '도트, 선, 여백을 활용한 일관된 시각 문법.' },
    { label: 'Packaging', desc: '제품을 보호하고, 브랜드 경험을 시작하는 공간.' },
  ]

  return (
    <section
      id="design"
      style={{
        background: 'var(--white)',
        paddingTop: 'var(--section-py)',
        paddingBottom: 'var(--section-py)',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 0, padding: '0 var(--pad-x) 48px' }}>
        <SectionLabel>Design Philosophy</SectionLabel>
      </div>

      {/* Full-bleed Header Image */}
      <div
        style={{
          width: '100%',
          aspectRatio: '16/9',
          background: 'var(--blue)',
          overflow: 'hidden',
          marginBottom: 40,
          position: 'relative',
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=450&fit=crop&auto=format"
          alt="CODEN design system overview"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.85 }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, transparent 60%, rgba(30,108,181,0.6) 100%)',
          }}
        />
      </div>

      {/* Pillars List */}
      <div style={{ padding: '0 var(--pad-x)' }}>
        {pillars.map((p, i) => (
          <div
            key={p.label}
            style={{
              padding: '24px 0',
              borderBottom: i < pillars.length - 1 ? '1px solid var(--gray-mid)' : 'none',
              borderTop: i === 0 ? '1px solid var(--gray-mid)' : 'none',
              display: 'grid',
              gridTemplateColumns: '1fr 2fr',
              gap: 16,
              alignItems: 'start',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: i === 0 ? 'var(--yellow)' : 'var(--blue)',
                  flexShrink: 0,
                }}
              />
              <p
                style={{
                  fontWeight: 700,
                  fontSize: '16px',
                  letterSpacing: '0.14em',
                  color: 'var(--black)',
                }}
              >
                {p.label}
              </p>
            </div>
            <p
              style={{
                fontSize: '13.5px',
                lineHeight: 1.75,
                letterSpacing: '0.07em',
                color: 'var(--gray-text)',
              }}
            >
              {p.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─── Footer Section ─── */
function Footer() {
  return (
    <footer style={{ background: 'var(--black)', color: 'var(--white)', padding: '36px var(--pad-x) 32px' }}>
      <div style={{ marginBottom: 24 }}>
        <p
          style={{
            fontWeight: 800,
            fontSize: '15.5px',
            letterSpacing: '0.14em',
            color: 'rgba(255,255,255,0.7)',
            marginBottom: 6,
          }}
        >
          CODEN
        </p>
        <p
          style={{
            fontWeight: 300,
            fontSize: '12px',
            color: 'rgba(255,255,255,0.55)',
            letterSpacing: '0.08em',
          }}
        >
          Capture. Connect. Create.
        </p>
      </div>

      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: 28,
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
              letterSpacing: '0.05em',
              lineHeight: 1.9,
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
            letterSpacing: '0.08em',
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
        <About />
        <Products />
        <Process />
        <ProductDetails />
        <Design />
        <Footer />
      </main>
    </div>
  )
}
