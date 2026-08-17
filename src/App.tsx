import { useState, useEffect } from 'react'

/* ─── Section IDs ─── */
const SECTIONS = ['hero', 'products', 'about', 'process', 'details', 'design', 'film'] as const
type SectionId = typeof SECTIONS[number]

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

/* ─── Active Section Hook ─── */
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

/* ─── Scroll Indicator ─── */
function ScrollIndicator({ activeSection }: { activeSection: SectionId }) {
  return (
    <div className="scroll-indicator">
      {SECTIONS.map((id) => (
        <div key={id} className="scroll-indicator__slot">
          <span
            className={`scroll-indicator__dot${
              activeSection === id ? ' scroll-indicator__dot--active' : ''
            }`}
          />
        </div>
      ))}
    </div>
  )
}

/* ─── Logo ─── */
function Logo() {
  return (
    <span
      style={{
        fontFamily: "'A2z', sans-serif",
        fontWeight: 800,
        fontSize: '22px',
        letterSpacing: '0.04em',
        color: 'var(--black)',
        userSelect: 'none',
      }}
    >
      C<span style={{ fontWeight: 400 }}>oo</span>DEN
    </span>
  )
}

/* ─── Hamburger ─── */
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

/* ─── Nav ─── */
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
        left: 0,
        right: 0,
        height: 'var(--nav-height)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        background: 'var(--white)',
        borderBottom: scrolled ? '1px solid var(--gray-mid)' : '1px solid transparent',
        transition: 'border-color 0.3s',
        zIndex: 100,
      }}
    >
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{ background: 'none', border: 'none', padding: '8px 8px 8px 0', cursor: 'pointer' }}
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

/* ─── Slide-in Menu ─── */
function Menu({ open, onClose, activeSection }: { open: boolean; onClose: () => void; activeSection: SectionId }) {
  const items = ['HOME', 'PRODUCTS', 'ABOUT', 'HOW TO USE', 'DETAILS', 'DESIGN', 'FILM']
  const ids: SectionId[] = ['hero', 'products', 'about', 'process', 'details', 'design', 'film']

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
          padding: '0 20px 24px',
        }}
      >
        {/* Close — nav-height 행 및 20px 여백에 맞춰 햄버거와 동일 위치 */}
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

        {/* Nav items */}
        <nav style={{ marginTop: 16 }}>
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
                    fontFamily: "'A2z', sans-serif",
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
        fontFamily: "'A2z', sans-serif",
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
        height: '100svh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--white)',
        overflow: 'hidden',
      }}
    >
      {/* Hero image */}
      <div
        style={{
          flex: '0 0 48svh',
          width: '100%',
          background: 'var(--blue)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&h=900&fit=crop&auto=format"
          alt="CODEN notebook system flat lay"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'var(--blue)',
          }}
        />
      </div>

      {/* Hero copy */}
      <div
        style={{
          flex: 1,
          padding: '0 20px 16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          gap: 24,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'A2z', sans-serif",
              fontWeight: 800,
              fontSize: '32px',
              letterSpacing: '0.03em',
              lineHeight: 1.35,
              color: 'var(--black)',
              marginBottom: 14,
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
              fontFamily: "'A2z', sans-serif",
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: 1.75,
              color: 'var(--black)',
            }}
          >
            기록하고. 연결하고. 확장하다.
            <br />
            CODEN은 일상의 생각을 의미 있는 아이디어로 바꿉니다.
          </p>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={() => scrollTo('products')}
          style={{
            alignSelf: 'center',
            width: 52,
            height: 52,
            borderRadius: '50%',
            border: '1.5px solid var(--black)',
            background: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s, border-color 0.2s',
          }}
          onMouseEnter={(e) => {
            const t = e.currentTarget
            t.style.background = 'var(--blue)'
            t.style.borderColor = 'var(--blue)'
          }}
          onMouseLeave={(e) => {
            const t = e.currentTarget
            t.style.background = 'none'
            t.style.borderColor = 'var(--black)'
          }}
          aria-label="Scroll down"
        >
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 3v10M4 9l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </section>
  )
}

/* ─── Products Section ─── */
function Products() {
  const items = [
    {
      name: 'NOTEBOOK',
      sub: 'CODEN 시스템의 핵심 노트',
      img: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=700&h=500&fit=crop&auto=format',
      alt: 'CODEN notebook open spread',
    },
    {
      name: 'PACKAGE',
      sub: '전체 시스템 패키지',
      img: 'https://images.unsplash.com/photo-1587467512961-120760940315?w=700&h=500&fit=crop&auto=format',
      alt: 'CODEN product package',
    },
    {
      name: 'BOOKMARK',
      sub: '페이지를 표시하는 북마크',
      img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=700&h=500&fit=crop&auto=format',
      alt: 'CODEN bookmark detail',
    },
  ]

  return (
    <section id="products" style={{ paddingTop: 64, paddingBottom: 64, background: 'var(--white)' }}>
      <div style={{ padding: '0 20px', marginBottom: 32, textAlign: 'center' }}>
        <SectionLabel>Product</SectionLabel>
      </div>

      {/* Full-bleed hero product */}
      <div style={{ marginBottom: 2 }}>
        <div
          style={{
            width: '100%',
            aspectRatio: '4/3',
            background: 'var(--gray-light)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <img
            src={items[0].img}
            alt={items[0].alt}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 20,
              left: 20,
            }}
          >
            <span
              style={{
                display: 'inline-block',
                background: 'var(--blue)',
                color: 'var(--white)',
                fontFamily: "'A2z', sans-serif",
                fontWeight: 700,
                fontSize: '13px',
                letterSpacing: '0.08em',
                padding: '5px 12px',
              }}
            >
              NOTEBOOK
            </span>
          </div>
        </div>
      </div>

      {/* 2-col product grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 2,
          margin: '2px 0 0',
        }}
      >
        {items.slice(1).map((item) => (
          <div
            key={item.name}
            style={{
              background: 'var(--gray-light)',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div style={{ aspectRatio: '1/1', overflow: 'hidden' }}>
              <img
                src={item.img}
                alt={item.alt}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <div style={{ padding: '12px 14px' }}>
              <p
                style={{
                  fontFamily: "'A2z', sans-serif",
                  fontWeight: 700,
                  fontSize: '14px',
                  letterSpacing: '0.05em',
                  color: 'var(--black)',
                  marginBottom: 2,
                }}
              >
                {item.name}
              </p>
              <p
                style={{
                  fontFamily: "'A2z', sans-serif",
                  fontSize: '12px',
                  color: 'var(--gray-text)',
                  lineHeight: 1.4,
                }}
              >
                {item.sub}
              </p>
            </div>
          </div>
        ))}
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
      style={{ background: '#f0f0ee', color: 'var(--black)', padding: '64px 20px', textAlign: 'center' }}
    >
      <p
        style={{
          fontFamily: "'A2z', sans-serif",
          fontWeight: 700,
          fontSize: '12px',
          letterSpacing: '0.14em',
          color: 'var(--gray-text)',
          textTransform: 'uppercase',
          marginBottom: 40,
        }}
      >
        About CODEN
      </p>

      <p
        style={{
          fontFamily: "'A2z', sans-serif",
          fontWeight: 800,
          fontSize: '16px',
          letterSpacing: '0.06em',
          color: 'var(--blue)',
          marginBottom: 36,
        }}
      >
        CODEN = CODE + NOTE
      </p>

      <div style={{ marginBottom: 40 }}>
        <div style={{ marginBottom: 36 }}>
          <p
            style={{
              fontFamily: "'A2z', sans-serif",
              fontWeight: 800,
              fontSize: '14px',
              letterSpacing: '0.05em',
              color: 'var(--black)',
              marginBottom: 4,
            }}
          >
            CODE
          </p>
          <p
            style={{
              fontFamily: "'A2z', sans-serif",
              fontSize: '14px',
              color: 'var(--gray-text)',
              lineHeight: 1.7,
            }}
          >
            생각과 기록을 일정한 방식으로 구조화하는 방법
          </p>
        </div>
        <div style={{ marginBottom: 20 }}>
          <p
            style={{
              fontFamily: "'A2z', sans-serif",
              fontWeight: 800,
              fontSize: '14px',
              letterSpacing: '0.05em',
              color: 'var(--black)',
              marginBottom: 4,
            }}
          >
            NOTE
          </p>
          <p
            style={{
              fontFamily: "'A2z', sans-serif",
              fontSize: '14px',
              color: 'var(--gray-text)',
              lineHeight: 1.7,
            }}
          >
            생각과 정보를 기록하는 행위
          </p>
        </div>
        <p
          style={{
            fontFamily: "'A2z', sans-serif",
            fontSize: '14px',
            color: 'var(--gray-text)',
            lineHeight: 1.75,
          }}
        >
          CODEN은 기록을 단순히 저장하는 것이 아니라,
          <br />
          수집하고 연결하며 자신의 생각으로 다시 정리하는
          <br />
          아날로그 메모 시스템입니다.
        </p>
      </div>

      <div style={{ width: 32, height: 2, background: 'var(--blue)', marginBottom: 36, margin: '0 auto 36px' }} />

      <div>
        <p
          style={{
            fontFamily: "'A2z', sans-serif",
            fontWeight: 700,
            fontSize: '12px',
            letterSpacing: '0.14em',
            color: 'var(--gray-text)',
            textTransform: 'uppercase',
            marginBottom: 32,
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
                gap: 6,
                paddingBottom: 18,
              }}
            >
              <p
                style={{
                  fontFamily: "'A2z', sans-serif",
                  fontWeight: 800,
                  fontSize: '15px',
                  letterSpacing: '0.05em',
                  color: 'var(--black)',
                }}
              >
                {step.en}
              </p>
              <p
                style={{
                  fontFamily: "'A2z', sans-serif",
                  fontSize: '14px',
                  color: 'var(--gray-text)',
                  lineHeight: 1.5,
                }}
              >
                {step.ko}
              </p>
            </div>
            {i < processSteps.length - 1 && (
              <div style={{ marginBottom: 6 }}>
                <span
                  style={{
                    color: 'var(--blue)',
                    fontSize: '18px',
                    lineHeight: 1,
                    display: 'block',
                    marginBottom: 18,
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
          marginTop: 36,
          paddingTop: 36,
          borderTop: '1px solid rgba(0,0,0,0.08)',
        }}
      >
        <p
          style={{
            fontFamily: "'A2z', sans-serif",
            fontWeight: 500,
            fontSize: '14px',
            color: 'var(--black)',
            lineHeight: 1.85,
          }}
        >
          기록은 생각이 됩니다.
          <br />
          흩어진 기록은 연결을 통해 새로운 의미를 만들고,
          <br />
          정리된 생각은 다시 새로운 아이디어로 이어집니다.
          <br />
          <br />
          CODEN은 기록하는 행위에서 끝나지 않고,
          <br />
          기록을 생각과 아이디어로 확장하는 과정을 제안하는 노트입니다.
        </p>
      </div>
    </section>
  )
}

/* ─── Process Section ─── */
function Process() {
  const steps = [
    {
      num: '01',
      title: '기록',
      en: 'Capture',
      desc: '일단, 적습니다. 떠오른 생각을 판단하지 않고 자유롭게 남깁니다.',
    },
    {
      num: '02',
      title: '선별',
      en: 'Select',
      desc: '남길 것을 골라냅니다. 쌓인 기록에서 지금 필요한 생각을 찾아냅니다.',
    },
    {
      num: '03',
      title: '연결',
      en: 'Connect',
      desc: '생각과 생각을 이어봅니다. 흩어진 기록 사이에서 새로운 관계를 발견합니다.',
    },
    {
      num: '04',
      title: '재발견',
      en: 'Rediscover',
      desc: '다시 꺼내, 새롭게 봅니다. 지나간 기록은 현재의 생각과 만나 새로운 아이디어가 됩니다.',
    },
    {
      num: '05',
      title: '확장',
      en: 'Expand',
      desc: '생각은 계속 이어집니다. 하나의 기록은 새로운 아이디어가 되고, 다시 다음 생각의 시작점이 됩니다.',
    },
  ]

  return (
    <section id="process" style={{ background: 'var(--white)', padding: '64px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: 48, padding: '0 20px' }}>
        <SectionLabel>How to Use</SectionLabel>
      </div>

      <div>
        {steps.map((step, i) => (
          <div key={step.num}>
            <div
              style={{
                padding: '28px 20px',
                borderTop: i === 0 ? '1px solid var(--gray-mid)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
                <span
                  style={{
                    fontFamily: "'A2z', sans-serif",
                    fontWeight: 700,
                    fontSize: '11px',
                    letterSpacing: '0.06em',
                    color: 'var(--yellow)',
                    background: 'var(--black)',
                    padding: '2px 7px',
                    lineHeight: 1.5,
                  }}
                >
                  {step.num}
                </span>
                <span
                  style={{
                    fontFamily: "'A2z', sans-serif",
                    fontWeight: 700,
                    fontSize: '20px',
                    letterSpacing: '0.04em',
                    color: 'var(--black)',
                  }}
                >
                  {step.title}
                </span>
                <span
                  style={{
                    fontFamily: "'A2z', sans-serif",
                    fontSize: '11px',
                    letterSpacing: '0.06em',
                    color: 'var(--gray-text)',
                    textTransform: 'uppercase',
                  }}
                >
                  {step.en}
                </span>
              </div>
              <p
                style={{
                  fontFamily: "'A2z', sans-serif",
                  fontSize: '14px',
                  lineHeight: 1.75,
                  color: '#444',
                  maxWidth: 320,
                }}
              >
                {step.desc}
              </p>
            </div>
            {i < steps.length - 1 && (
              <div style={{ marginLeft: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 1, height: 24, background: 'var(--gray-mid)', marginLeft: 16 }} />
              </div>
            )}
            <div style={{ borderBottom: '1px solid var(--gray-mid)' }} />
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─── Product Details Section ─── */
function ProductDetails() {
  const [active, setActive] = useState<string>('NOTEBOOK')

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
          CODEN의 완전한 기록 시스템.
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

  const current = products[active as keyof typeof products]

  return (
    <section id="details" style={{ background: 'var(--white)', paddingTop: 64 }}>
      <div style={{ textAlign: 'center', marginBottom: 32, padding: '0 20px' }}>
        <SectionLabel>Product Detail</SectionLabel>
      </div>

      {/* Tab bar */}
      <div
        style={{
          display: 'flex',
          borderTop: '1px solid var(--gray-mid)',
          borderBottom: '1px solid var(--gray-mid)',
          padding: '0 16px',
          overflowX: 'auto',
        }}
      >
        {Object.keys(products).map((key) => (
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
              fontFamily: "'A2z', sans-serif",
              fontWeight: 700,
              fontSize: '12px',
              letterSpacing: '0.06em',
              color: active === key ? 'var(--blue)' : 'var(--gray-text)',
              transition: 'color 0.2s, border-color 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Product image */}
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
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>

      {/* Product info */}
      <div style={{ padding: '28px 20px 64px' }}>
        <h3
          style={{
            fontFamily: "'A2z', sans-serif",
            fontWeight: 800,
            fontSize: '28px',
            letterSpacing: '0.04em',
            color: 'var(--black)',
            marginBottom: 10,
          }}
        >
          {current.label}
        </h3>
        <p
          style={{
            fontFamily: "'A2z', sans-serif",
            fontSize: '14px',
            lineHeight: 1.75,
            color: '#555',
            marginBottom: 24,
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
                padding: '10px 0',
                borderBottom: i < current.specs.length - 1 ? '1px solid var(--gray-mid)' : 'none',
              }}
            >
              <span
                style={{
                  fontFamily: "'A2z', sans-serif",
                  fontSize: '13px',
                  color: 'var(--black)',
                  letterSpacing: '0.02em',
                }}
              >
                {spec.split('—')[0].trim()}
              </span>
              <span
                style={{
                  fontFamily: "'A2z', sans-serif",
                  fontSize: '13px',
                  color: 'var(--gray-text)',
                }}
              >
                {spec.split('—')[1]?.trim()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Design Section ─── */
function Design() {
  const pillars = [
    { label: 'Logo', desc: '단순하고 명확한 레터마크. CODE와 NOTE의 결합을 표현합니다.' },
    { label: 'Color', desc: '블루 — 구조와 신뢰. 옐로우 — 아이디어와 연결의 순간.' },
    { label: 'Typography', desc: '명확한 위계를 위한 서체 시스템. 읽기 위한 디자인.' },
    { label: 'Graphic System', desc: '도트, 선, 여백을 활용한 일관된 시각 문법.' },
    { label: 'Packaging', desc: '제품을 보호하고, 브랜드 경험을 시작하는 공간.' },
  ]

  return (
    <section id="design" style={{ background: 'var(--white)', paddingTop: 64, paddingBottom: 64 }}>
      <div style={{ textAlign: 'center', marginBottom: 0, padding: '0 20px 32px' }}>
        <SectionLabel>Design Philosophy</SectionLabel>
      </div>

      {/* Full-bleed image */}
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

      {/* Pillars list */}
      <div style={{ padding: '0 20px' }}>
        {pillars.map((p, i) => (
          <div
            key={p.label}
            style={{
              padding: '22px 0',
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
                  fontFamily: "'A2z', sans-serif",
                  fontWeight: 700,
                  fontSize: '16px',
                  letterSpacing: '0.04em',
                  color: 'var(--black)',
                }}
              >
                {p.label}
              </p>
            </div>
            <p
              style={{
                fontFamily: "'A2z', sans-serif",
                fontSize: '13.5px',
                lineHeight: 1.65,
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

/* ─── Film Section ─── */
function Film() {
  return (
    <section id="film" style={{ background: 'var(--gray-light)', paddingTop: 64, paddingBottom: 120 }}>
      <div style={{ textAlign: 'center', marginBottom: 32, padding: '0 20px' }}>
        <SectionLabel>Brand Film</SectionLabel>
      </div>

      <div
        style={{
          margin: '0 20px',
          background: 'var(--black)',
          aspectRatio: '16/9',
          position: 'relative',
          cursor: 'pointer',
          overflow: 'hidden',
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=700&h=400&fit=crop&auto=format"
          alt="Brand film thumbnail"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.5 }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              border: '2px solid var(--white)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M6 4l12 6-12 6V4z" fill="white" />
            </svg>
          </div>
        </div>
      </div>


    </section>
  )
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer style={{ background: 'var(--black)', color: 'var(--white)', padding: '28px 20px 24px' }}>
      <div style={{ marginBottom: 20 }}>
        <p
          style={{
            fontFamily: "'A2z', sans-serif",
            fontWeight: 800,
            fontSize: '18px',
            letterSpacing: '0.06em',
            color: 'var(--white)',
            marginBottom: 6,
          }}
        >
          CODEN
        </p>
        <p
          style={{
            fontFamily: "'A2z', sans-serif",
            fontWeight: 300,
            fontSize: '14px',
            color: 'rgba(255,255,255,0.55)',
            letterSpacing: '0.02em',
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
              fontFamily: "'A2z', sans-serif",
              fontSize: '12px',
              color: 'rgba(255,255,255,0.3)',
              lineHeight: 1.8,
            }}
          >
            Designed by Suyeon
            <br />
            Email 2suuui@naver.com
          </p>
        </div>
        <p
          style={{
            fontFamily: "'A2z', sans-serif",
            fontSize: '12px',
            letterSpacing: '0.04em',
            color: 'rgba(255,255,255,0.25)',
          }}
        >
          © 2026 CODEN.
        </p>
      </div>
    </footer>
  )
}

/* ─── App Root ─── */
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
    <div style={{ maxWidth: 480, margin: '0 auto', position: 'relative' }}>
      <Nav onMenuOpen={() => setMenuOpen(true)} />
      <Menu open={menuOpen} onClose={() => setMenuOpen(false)} activeSection={activeSection} />
      <ScrollIndicator activeSection={activeSection} />

      <main>
        <Hero />
        <Products />
        <About />
        <Process />
        <ProductDetails />
        <Design />
        <Film />
        <Footer />
      </main>
    </div>
  )
}
