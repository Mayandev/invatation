'use client';

import { useReveal } from '@/hooks/useReveal';
import { wedding } from '@/lib/wedding';

export function Footer() {
  const { ref, isVisible } = useReveal<HTMLElement>();

  return (
    <footer ref={ref} className={`footer section-reveal${isVisible ? ' is-visible' : ''}`}>
      <div className="footer__seal">囍</div>
      <p>山高水长 · 喜乐未央</p>
      <p className="footer__names">
        <span>{wedding.groom}</span> · <span>{wedding.bride}</span>
      </p>
    </footer>
  );
}
