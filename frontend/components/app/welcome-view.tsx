'use client';

import type { ComponentProps, ReactNode } from 'react';
import { Bell, CheckCircle2, Mic, Play, Search, Tag, TrendingDown } from 'lucide-react';
import styles from './medical-affairs-landing.module.css';

const LOGO_SRC = '/kol-copilot-logo-mark.svg';

interface WelcomeViewProps {
  startButtonText: string;
  onStartCall: () => void;
}

function VoiceControlPreview({
  transcript,
  state = 'Listening',
}: {
  transcript: string;
  state?: string;
}) {
  return (
    <div className="voice-control">
      <div className="voice-control__top">
        <span className="voice-control__button" aria-hidden="true">
          <Mic size={20} />
        </span>
        <div className="voice-control__meta">
          <div className="voice-control__status">{state} · 0:04</div>
          <div className="voice-control__transcript">{transcript}</div>
        </div>
      </div>
      <div className="wave" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, index) => (
          <span key={index} />
        ))}
      </div>
    </div>
  );
}

function HeroVisual() {
  return (
    <div className="device">
      <div className="device__bar">
        <span className="device__dot" />
        <span className="device__title">
          Sony WH-1000XM5<span className="device__sub"> · Wireless headphones</span>
        </span>
        <span className="badge">Live</span>
      </div>
      <div className="device__body">
        <VoiceControlPreview transcript="Find me the cheapest Sony WH-1000XM5" />
        <div className="kol-card">
          <div className="kol-card__header">
            <span className="kol-card__rank">01</span>
            <span className="avatar" aria-hidden="true">
              <Tag size={16} />
            </span>
            <div className="kol-card__identity">
              <div className="kol-card__name">Sony WH-1000XM5</div>
              <div className="kol-card__inst">Amazon · in stock</div>
            </div>
            <div className="kol-card__score">
              <div className="kol-card__score-value">$147</div>
              <div className="kol-card__score-label">best price</div>
            </div>
          </div>
          <div className="kol-card__meta-row">
            <span className="kol-card__meta">
              Wireless noise-cancelling <span> · free shipping</span>
            </span>
            <span className="badge badge--safe">Best price</span>
          </div>
          <div>
            <div className="score-bar" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="score-legend">
              <span>Amazon 147</span>
              <span>Walmart 195</span>
              <span>Best Buy 210</span>
              <span>Target 248</span>
            </div>
          </div>
          <p className="kol-card__rationale">
            Lowest live price found across 8 retailers — about 30 dollars under the typical listing.
          </p>
          <div className="kol-card__footer">
            <span className="citation-count">8 retailers checked</span>
            <span style={{ flex: 1 }} />
            <span className="mini-action mini-action--ghost">View listing</span>
            <span className="mini-action mini-action--primary">Watch price</span>
          </div>
        </div>
        <div className="compliance-panel">
          <div className="compliance-panel__head">
            <div className="compliance-panel__title">Live web research</div>
            <span className="badge badge--compliance">Bright Data</span>
          </div>
          <div className="check-list">
            <span>
              <CheckCircle2 /> Real-time prices from across the web
            </span>
            <span>
              <CheckCircle2 /> Ranked cheapest first
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function VoiceCopilotPreview() {
  return (
    <div className="voice">
      <VoiceControlPreview
        transcript="What's the cheapest Sony WH-1000XM5 right now?"
        state="Searching"
      />
      <div className="qa">
        <div className="qa__q">
          <span className="qa__role">You</span>
          <p>What&apos;s the cheapest Sony WH-1000XM5 right now?</p>
        </div>
        <div className="qa__a">
          <span className="qa__role qa__role--ai">
            <span className="qa__avatar">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={LOGO_SRC} alt="" width="20" height="20" />
            </span>
            Deal Hunter
          </span>
          <p>
            The best price I found is one hundred forty seven dollars at Amazon, about thirty
            dollars under the typical listing. Walmart is next at one hundred ninety five.
          </p>
          <div className="qa__foot">
            <span className="qa__chip">8 retailers checked</span>
            <span className="qa__guard">Live web data · updated moments ago</span>
          </div>
        </div>
        <div className="qa__q">
          <span className="qa__role">You</span>
          <p>Watch it and tell me if it drops below one thirty.</p>
        </div>
        <div className="qa__a">
          <span className="qa__role qa__role--ai">
            <span className="qa__avatar">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={LOGO_SRC} alt="" width="20" height="20" />
            </span>
            Deal Hunter
          </span>
          <p className="qa__doc">
            Done — I&apos;ll remember your one hundred thirty dollar target and let you know if the
            price drops that low.
          </p>
          <div className="qa__foot">
            <span className="qa__chip qa__chip--safe">Saved to memory</span>
            <span className="qa__guard">Tracking your price target</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StartButton({
  children,
  onStartCall,
  variant = 'primary',
}: {
  children: ReactNode;
  onStartCall: () => void;
  variant?: 'primary' | 'secondary' | 'ghost-dark';
}) {
  return (
    <button type="button" className={`btn btn--lg btn--${variant}`} onClick={onStartCall}>
      {children}
    </button>
  );
}

export const WelcomeView = ({
  startButtonText,
  onStartCall,
  ref,
}: ComponentProps<'div'> & WelcomeViewProps) => {
  return (
    <div ref={ref} className={styles.root}>
      <header className="nav">
        <div className="nav__inner">
          <a href="#top" className="brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_SRC} alt="Deal Hunter" />
            <span className="brand__name">Deal Hunter</span>
            <span className="brand__tag">Voice Shopping</span>
          </a>
          <nav className="nav__links" aria-label="Landing page sections">
            <a href="#how">How it works</a>
            <a href="#features">Capabilities</a>
            <a href="#voice">Voice copilot</a>
          </nav>
          <div className="nav__cta">
            <button type="button" className="btn btn--primary" onClick={onStartCall}>
              <Mic />
              {startButtonText}
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="wrap hero__grid">
            <div>
              <span className="eyebrow">Voice-first price hunting</span>
              <h1>Find the best price, just by asking.</h1>
              <p className="hero__lede">
                Deal Hunter is a voice shopping copilot. Say what you want and it searches live web
                data across retailers, ranks the cheapest options first, and reads them back to you.
                Ask it to watch an item and it remembers your target price for next time.
              </p>
              <div className="hero__cta">
                <StartButton onStartCall={onStartCall}>
                  <Mic />
                  {startButtonText}
                </StartButton>
                <a href="#voice" className="btn btn--secondary btn--lg">
                  <Play />
                  Watch demo
                </a>
              </div>
              <div className="hero__trust">
                <TrendingDown />
                Live prices from across the web · updated the moment you ask
              </div>
            </div>
            <HeroVisual />
          </div>
        </section>

        <section className="market">
          <div className="wrap market__inner">
            <span className="eyebrow">Why voice</span>
            <p className="market__lead">
              Price research means <span className="market__num">tab-hopping</span> across a dozen
              sites. <b>Deal Hunter does it in one spoken question.</b>
            </p>
            <div className="market__cols">
              <div className="market__col">
                <div className="k">01 - Ask</div>
                <div className="v">Say what you want to buy</div>
              </div>
              <div className="market__col">
                <div className="k">02 - Compare</div>
                <div className="v">Live prices, ranked cheapest first</div>
              </div>
              <div className="market__col">
                <div className="k">03 - Track</div>
                <div className="v">Watch items for price drops</div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="how">
          <div className="wrap">
            <div className="section__head">
              <span className="eyebrow">How it works</span>
              <h2>Ask out loud. Get the best price back.</h2>
              <p>
                Speak a product and Deal Hunter searches the live web for current listings, extracts
                and ranks prices, remembers what you care about, and answers in a natural voice —
                all in a few seconds.
              </p>
            </div>

            <div className="pipe">
              {[
                {
                  num: '01',
                  title: 'Ask',
                  tags: ['LiveKit voice'],
                  desc: 'Say what you are shopping for out loud. No typing, no tabs.',
                },
                {
                  num: '02',
                  title: 'Search',
                  tags: ['Bright Data SERP'],
                  desc: 'Live web search finds current listings for the product across retailers.',
                },
                {
                  num: '03',
                  title: 'Rank',
                  tags: ['Price parsing'],
                  desc: 'Every listing is parsed for price and ranked so the cheapest option is first.',
                  chips: ['Amazon', 'Walmart', 'Best Buy', 'Target'],
                },
                {
                  num: '04',
                  title: 'Remember',
                  tags: ['Moss Index'],
                  desc: 'Your watched items, budget, and preferences are saved so it picks up where you left off.',
                },
                {
                  num: '05',
                  title: 'Speak',
                  optional: true,
                  tags: ['LiveKit voice'],
                  desc: 'The best deals are read back to you in a short, natural conversation.',
                },
              ].map((step) => (
                <div className="step" key={step.num}>
                  <div className="step__num">{step.num}</div>
                  <div className="step__body">
                    <div>
                      <div className="step__title">
                        {step.title}
                        {step.optional && <span className="opt">Optional</span>}
                      </div>
                      <div className="stack-row">
                        {step.tags.map((tag) => (
                          <span className="stack-tag" key={tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="step__desc">
                      {step.desc}
                      {step.chips && (
                        <div className="chips">
                          {step.chips.map((chip) => (
                            <span className="chip" key={chip}>
                              {chip}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section features" id="features">
          <div className="wrap">
            <div className="section__head">
              <span className="eyebrow">Capabilities</span>
              <h2>Everything you need to shop by voice.</h2>
            </div>
            <div className="feat-grid">
              <div className="feat">
                <div className="feat__icon feat__icon--accent">
                  <Search />
                </div>
                <h3>Live web prices</h3>
                <p>
                  Real prices pulled from across the web the moment you ask — never a stale cache.
                </p>
              </div>
              <div className="feat">
                <div className="feat__icon feat__icon--evidence">
                  <TrendingDown />
                </div>
                <h3>Cheapest-first ranking</h3>
                <p>
                  Every result is parsed for price and ranked, so the best deal is always the first
                  thing you hear.
                </p>
              </div>
              <div className="feat">
                <div className="feat__icon feat__icon--compliance">
                  <Bell />
                </div>
                <h3>Price watch &amp; memory</h3>
                <p>
                  Save an item to watch, set a target price, and Deal Hunter remembers it for the
                  next time you ask.
                </p>
              </div>
              <div className="feat">
                <div className="feat__icon feat__icon--accent">
                  <Mic />
                </div>
                <h3>Voice copilot</h3>
                <p>Ask, compare, and track deals completely hands-free.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="voice">
          <div className="wrap">
            <div className="voice-grid">
              <div className="section__head">
                <span className="eyebrow">Voice copilot</span>
                <h2>Ask in plain language. Hear the best deal.</h2>
                <p>
                  Compare products, get the cheapest live price, and set a watch — all by voice.
                  Every price comes straight from a live web search, ranked so the best option is
                  first.
                </p>
              </div>
              <VoiceCopilotPreview />
            </div>
          </div>
        </section>

        <section className="closing">
          <div className="wrap closing__inner">
            <span className="eyebrow">The shift</span>
            <h2>
              Deal Hunter turns &quot;find me the best price&quot; into a{' '}
              <span className="em">single spoken question</span>.
            </h2>
            <div className="closing__cta">
              <StartButton onStartCall={onStartCall}>
                <Mic />
                {startButtonText}
              </StartButton>
              <a href="#voice" className="btn btn--ghost-dark btn--lg">
                <Play />
                Watch demo
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer__inner">
          <span className="brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_SRC} alt="" />
            <span className="brand__name">Deal Hunter</span>
          </span>
          <span className="footer__note">
            Live web prices · cheapest-first · watch for price drops
          </span>
          <span className="footer__copy">© 2026</span>
        </div>
      </footer>
    </div>
  );
};
