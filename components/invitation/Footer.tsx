'use client';

import { useReveal } from '@/hooks/useReveal';
import { wedding } from '@/lib/wedding';

export function Footer() {
  const { ref, isVisible } = useReveal<HTMLElement>();

  return (
    <footer ref={ref} className={`footer section-reveal${isVisible ? ' is-visible' : ''}`}>
      <p className="footer__kicker">SEE YOU AT OUR WEDDING</p>
      <p className="footer__names">
        <span>{wedding.groom}</span> <i>&amp;</i> <span>{wedding.bride}</span>
      </p>
      <p>OCTOBER 06, 2026 · JI&apos;AN</p>
      <div className="footer__photo" aria-hidden="true" />
      <p className="footer__signoff">LOVE, LAUGHTER &amp; HAPPILY EVER AFTER.</p>
    </footer>
  );
}
