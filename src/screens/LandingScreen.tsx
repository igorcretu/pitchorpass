import { useEffect, useRef } from 'react'
import { useGameStore } from '../store/gameStore'

const DECO_CARDS = [
  { type: 'ethos', label: 'Ethos', text: 'Name a partner' },
  { type: 'logos', label: 'Logos', text: 'Drop a statistic' },
  { type: 'pathos', label: 'Pathos', text: 'Tell a personal story' },
  { type: 'logos', label: 'Logos', text: 'Show the business model' },
  { type: 'ethos', label: 'Ethos', text: 'Reference past success' },
]

const INVESTORS = [
  { emoji: '📐', name: 'The Skeptical Professor', pref: 'Logos',         type: 'logos',  blurb: 'Show your data or don\'t bother showing up.' },
  { emoji: '🚀', name: 'The Excited Tech VC',     pref: 'Pathos',        type: 'pathos', blurb: 'Wants to believe. Sell the vision, not the spreadsheet.' },
  { emoji: '🏦', name: 'The Risk-Averse Banker',  pref: 'Ethos',         type: 'ethos',  blurb: 'Track record and credibility above everything.' },
  { emoji: '🛒', name: 'The Customer Advocate',   pref: 'Pathos',        type: 'pathos', blurb: 'Is this solving a real human problem? Show them.' },
  { emoji: '💼', name: 'The Angel Investor',       pref: 'Ethos + Logos', type: 'mixed',  blurb: 'The hardest to please. Balance credibility with evidence.' },
]

export function LandingScreen() {
  const { goToSetup } = useGameStore()
  const fadeRefs = useRef<HTMLElement[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) } }),
      { threshold: 0.1 }
    )
    fadeRefs.current.forEach(el => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const ref = (el: HTMLElement | null) => { if (el) fadeRefs.current.push(el) }

  return (
    <div className="landing">
      {/* Floating deco cards */}
      <div className="deco-cards" aria-hidden="true">
        {DECO_CARDS.map((c, i) => (
          <div key={i} className={`deco-card ${c.type}`}>
            <div className="deco-card-label">{c.label}</div>
            {c.text}
          </div>
        ))}
      </div>

      {/* Hero */}
      <div className="hero">
        <nav className="landing-nav">
          <div className="landing-logo">P/P</div>
          <div className="nav-tag">DTU · Entrepreneurial Mindset</div>
        </nav>

        <div className="hero-center">
          <div className="eyebrow">A serious game for learning the art of pitching</div>
          <h1 className="hero-title">
            PITCH
            <span className="hero-or">or</span>
            PASS
          </h1>
          <p className="hero-sub">
            You are a startup founder. <strong>Five investors. Five chances.</strong>{' '}
            Read the room, choose your cards, survive the objections.
          </p>
          <div className="cta-row">
            <button className="btn-primary landing-cta" onClick={goToSetup}>Start Playing</button>
            <a href="#how" className="btn-ghost">How it works ↓</a>
          </div>
        </div>

        <div className="hero-footer">
          <span>AI-Powered · Browser-Based</span>
          <div className="scroll-hint">
            <span>Scroll</span>
            <div className="scroll-line" />
          </div>
          <span>Session 9</span>
        </div>
      </div>

      {/* Problem */}
      <section id="how">
        <div className="section-label fade-up" ref={ref}>The Problem</div>
        <h2 className="fade-up" ref={ref}>Most students pitch<br />once. Real founders<br />pitch constantly.</h2>
        <div className="problems fade-up" ref={ref as any}>
          {[
            { n: '01', title: 'No Safe Space', body: 'Real pitches have real stakes. Students freeze, over-rehearse, or avoid it entirely.' },
            { n: '02', title: 'No Feedback Loop', body: 'Vague reactions like "good job" don\'t tell you what actually landed with the investor.' },
            { n: '03', title: 'One Audience Only', body: 'You rehearse for one persona. Real pitching requires instant adaptation to whoever is in the room.' },
          ].map(p => (
            <div key={p.n} className="problem-card">
              <div className="problem-num">{p.n}</div>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Loop */}
      <section>
        <div className="section-label fade-up" ref={ref}>The Loop</div>
        <h2 className="fade-up" ref={ref}>Four moves. Zero<br />second chances.</h2>
        <div className="loop fade-up" ref={ref as any}>
          {[
            { n: '1', title: 'DRAW',    body: 'Get a random startup idea + investor persona. Read context clues about their preferences.' },
            { n: '2', title: 'PICK',    body: 'Choose 3 pitch cards from your hand — balancing Ethos, Pathos, and Logos.' },
            { n: '3', title: 'PITCH',   body: 'Speak your pitch out loud. The AI investor reacts based on what you said and the cards you played.' },
            { n: '4', title: 'REFLECT', body: 'Get immediate feedback + a reaction quote. Adjust strategy for the next investor.' },
          ].map(s => (
            <div key={s.n} className="loop-step">
              <div className="loop-step-num">{s.n}</div>
              <h3 className="loop-step-title">{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mechanics */}
      <section>
        <div className="section-label fade-up" ref={ref}>Mechanics</div>
        <h2 className="fade-up" ref={ref}>Designed to stress-test<br />every part of a pitch.</h2>
        <div className="mechanics-grid fade-up" ref={ref as any}>
          {[
            { icon: '⏱', title: 'Time Pressure',    body: '90-second pitch window. Shrinking limits force prioritisation of what truly matters.' },
            { icon: '🎭', title: 'Random Personas',  body: 'Different investor every round — tech VC, skeptical professor, risk-averse banker. Instant adaptation required.' },
            { icon: '🔥', title: 'Interrupt Mode',   body: 'The AI investor interrupts mid-pitch with a hard question. Recover and finish within the original time limit.' },
            { icon: '❓', title: 'So What? Challenge', body: 'After each card, the AI can demand justification before you play the next one. Every claim must earn its place.' },
            { icon: '📊', title: 'Reputation Score', body: 'Early failures carry forward — later investors are harder to convince if word gets out you fumbled.' },
            { icon: '🎲', title: 'Random Topic',     body: '10 seconds to read the brief, then pitch a startup you\'ve never prepared for. Is the skill real or rehearsed?' },
          ].map(m => (
            <div key={m.title} className="mechanic">
              <div className="mechanic-icon">{m.icon}</div>
              <h3>{m.title}</h3>
              <p>{m.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cards */}
      <section>
        <div className="section-label fade-up" ref={ref}>The Cards</div>
        <h2 className="fade-up" ref={ref}>Seven cards in hand.<br />Pick three. Win the room.</h2>
        <div className="rhetoric-grid fade-up" ref={ref as any}>
          {([
            { type: 'ethos',  label: 'Ethos',  cards: ['Show credentials', 'Name a partner', 'Reference past success'] },
            { type: 'pathos', label: 'Pathos', cards: ['Tell a personal story', 'Show the human impact', 'Paint the future'] },
            { type: 'logos',  label: 'Logos',  cards: ['Drop a statistic', 'Show the business model', 'Use an analogy'] },
          ] as const).map(col => (
            <div key={col.type} className={`rhetoric-col ${col.type}`}>
              <div className="rhetoric-header">{col.label}</div>
              <div className="rhetoric-cards">
                {col.cards.map(c => <div key={c} className="pitch-card-demo">{c}</div>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Investors */}
      <section>
        <div className="section-label fade-up" ref={ref}>Investor Pool</div>
        <h2 className="fade-up" ref={ref}>Five personas.<br />Five hidden agendas.</h2>
        <div className="investors-row fade-up" ref={ref as any}>
          {INVESTORS.map(inv => (
            <div key={inv.name} className={`investor-card ${inv.type}`}>
              <div className="investor-avatar">{inv.emoji}</div>
              <h3>{inv.name}</h3>
              <div className="investor-pref">Favours: {inv.pref}</div>
              <p>{inv.blurb}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="cta-section">
        <div className="section-label fade-up" ref={ref}>Ready?</div>
        <h2 className="cta-title fade-up" ref={ref}>Pitch.<br />Or Pass.</h2>
        <p className="fade-up" ref={ref} style={{ color: 'var(--muted)', maxWidth: 380, margin: '0 auto 2.5rem', fontSize: '0.9rem', lineHeight: 1.7 }}>
          Secure funding from 3 of 5 investors to win. Failure is a learning tool — not a game over screen.
        </p>
        <button className="btn-primary landing-cta fade-up" ref={ref} onClick={goToSetup}>
          Start the Game
        </button>
      </div>

      <footer className="landing-footer">
        <span>Pitch or Pass</span>
        <span>DTU — Developing an Entrepreneurial Mindset · Session 9</span>
        <span>AI-Powered</span>
      </footer>
    </div>
  )
}
