'use client';

import { useReveal } from '@/hooks/useReveal';

export function Footer() {
  const { ref, isVisible } = useReveal<HTMLElement>();

  return (
    <footer ref={ref} className={`footer section-reveal${isVisible ? ' is-visible' : ''}`}>
      <p className="footer__kicker">SEE YOU AT OUR WEDDING</p>
      <p className="footer__names">
        <span>好久不见，<br></br>婚礼见</span>
      </p>
      <p style={{ marginTop: '20px' }}>OCTOBER 06, 2026 · JI&apos;AN</p>
      <div className="footer__photo" aria-hidden="true" />
      <p className="footer__signoff">LOVE, LAUGHTER &amp; HAPPILY EVER AFTER.</p>
    </footer>
  );
}
