'use client';

import type { ComponentProps } from 'react';
import { ArrowRight } from 'lucide-react';
import styles from './editorial.module.css';

const LOGO_SRC = '/deal-hunter-logo-mark.svg';

interface WelcomeViewProps {
  startButtonText: string;
  onStartCall: () => void;
}

const STEPS = [
  {
    num: '01',
    title: 'Ask',
    text: 'Say what you want to buy, out loud. No typing, no tabs, no forms.',
  },
  {
    num: '02',
    title: 'Search',
    text: 'A live web search finds current listings for it across retailers.',
  },
  {
    num: '03',
    title: 'Hear',
    text: 'The cheapest options are ranked and read back to you in seconds.',
  },
];

const STACK = [
  {
    name: 'Bright Data',
    role: 'Live web data',
    text: 'Searches the live web for real, current prices — ranked cheapest first.',
  },
  {
    name: 'Moss',
    role: 'Memory',
    text: 'Remembers what you are watching, your budget, and your preferences.',
  },
  {
    name: 'LiveKit',
    role: 'Voice',
    text: 'Real-time voice — it listens, thinks, and talks back naturally.',
  },
];

const EXAMPLE_DEALS = [
  { price: '$147', store: 'Amazon', best: true },
  { price: '$195', store: 'Walmart', best: false },
  { price: '$210', store: 'Best Buy', best: false },
];

export const WelcomeView = ({
  startButtonText,
  onStartCall,
  ref,
}: ComponentProps<'div'> & WelcomeViewProps) => {
  return (
    <div ref={ref} className={styles.root}>
      <header className={styles.nav}>
        <div className={styles.navInner}>
          <a href="#top" className={styles.brand}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_SRC} alt="" />
            Deal Hunter
          </a>
          <nav className={styles.navLinks} aria-label="Sections">
            <a href="#how" className={styles.navLink}>
              How it works
            </a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className={styles.hero}>
          <div className={styles.container}>
            <p className={styles.eyebrow}>Voice shopping copilot</p>
            <h1 className={styles.title}>
              Find the best price, <em>just by asking.</em>
            </h1>
            <p className={styles.lede}>
              Deal Hunter is a voice copilot that searches the live web for current prices, ranks
              them cheapest-first, and reads the best options back to you — then remembers the ones
              you want to watch.
            </p>
            <div className={styles.ctaRow}>
              <button type="button" className={styles.cta} onClick={onStartCall}>
                {startButtonText}
                <ArrowRight size={18} />
              </button>
              <span className={styles.hint}>
                Try saying <b>&ldquo;the cheapest Sony WH-1000XM5&rdquo;</b>
              </span>
            </div>
          </div>
        </section>

        <section className={styles.section} id="how">
          <div className={styles.container}>
            <p className={styles.sectionLabel}>How it works</p>
            <div className={styles.steps}>
              {STEPS.map((step) => (
                <div className={styles.step} key={step.num}>
                  <div className={styles.stepNum}>{step.num}</div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepText}>{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <p className={styles.sectionLabel}>What it runs on</p>
            <div className={styles.stack}>
              {STACK.map((item) => (
                <div className={styles.stackItem} key={item.name}>
                  <p className={styles.stackName}>
                    <span className={styles.stackDot} />
                    {item.name}
                  </p>
                  <p className={styles.stackRole}>{item.role}</p>
                  <p className={styles.stackText}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.exampleWrap}>
              <div className={styles.exampleCopy}>
                <h2>One question. The best price, spoken back.</h2>
                <p>
                  Every price comes straight from a live web search — never a stale cache — ranked
                  so the best deal is always the first thing you hear.
                </p>
              </div>
              <div className={styles.card}>
                <span className={styles.exTag}>Example</span>
                <p className={styles.exAsk}>
                  <span>You</span>
                  What&rsquo;s the cheapest Sony WH-1000XM5 right now?
                </p>
                <ul className={styles.exList}>
                  {EXAMPLE_DEALS.map((deal) => (
                    <li
                      key={deal.store}
                      className={deal.best ? `${styles.exRow} ${styles.exBest}` : styles.exRow}
                    >
                      <span className={styles.exPrice}>
                        {deal.price}
                        {deal.best && <span className={styles.exBestTag}>Best price</span>}
                      </span>
                      <span className={styles.exStore}>{deal.store}</span>
                    </li>
                  ))}
                </ul>
                <p className={styles.exReply}>
                  <span>Deal Hunter</span>
                  The best price I found is one hundred forty seven dollars at Amazon — about thirty
                  under the typical listing. Want me to watch it for a drop?
                </p>
                <p className={styles.exNote}>
                  Illustrative. Live results appear when you start the voice demo.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.closing}>
          <div className={styles.container}>
            <h2>Stop tab-hopping for prices. Just ask.</h2>
            <div className={styles.ctaRow}>
              <button type="button" className={styles.cta} onClick={onStartCall}>
                {startButtonText}
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span className={styles.brand}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_SRC} alt="" />
            Deal Hunter
          </span>
          <span>Bright Data · Moss · LiveKit</span>
          <span>© 2026</span>
        </div>
      </footer>
    </div>
  );
};
