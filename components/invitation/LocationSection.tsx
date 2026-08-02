'use client';

import { useReveal } from '@/hooks/useReveal';
import { useToast } from '@/components/shared/Toast';
import { wedding } from '@/lib/wedding';

export function LocationSection() {
  const { ref, isVisible } = useReveal<HTMLElement>();
  const showToast = useToast();

  async function handleCopyAddress() {
    try {
      await navigator.clipboard.writeText(wedding.address);
      showToast('宴址已复制');
    } catch {
      showToast(wedding.address);
    }
  }

  return (
    <section ref={ref} className={`content-section location-section section-reveal${isVisible ? ' is-visible' : ''}`}>
      <p className="section-kicker">叁 · 雅集</p>
      <h2 className="section-title">静候君临</h2>
      <div className="venue-card">
        <div className="venue-card__pin" aria-hidden="true">
          <span />
        </div>
        <p className="venue-card__city">{wedding.city}</p>
        <h3>{wedding.venue}</h3>
        <p>{wedding.address}</p>
        <button className="text-button" id="copyAddress" type="button" onClick={handleCopyAddress}>
          复制宴址
        </button>
      </div>
    </section>
  );
}
