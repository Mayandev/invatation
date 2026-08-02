'use client';

import { useReveal } from '@/hooks/useReveal';
import { wedding } from '@/lib/wedding';

export function Hero() {
  const { ref, isVisible } = useReveal<HTMLElement>();

  return (
    <header ref={ref} className={`hero section-reveal${isVisible ? ' is-visible' : ''}`}>
      <div className="hero__content">
        <span className="hero__seal" aria-hidden="true">囍</span>
        <p className="eyebrow">良 辰 已 定 · 敬 候 君 临</p>
        <p className="hero__small">两姓联姻 · 一堂缔约</p>
        <h2>
          <span className="hero__name">{wedding.groom}</span>
          <b> 与 </b>
          <span className="hero__name">{wedding.bride}</span>
        </h2>
        <div className="ornament">
          <span />
          <i>囍</i>
          <span />
        </div>
        <p className="hero__verse">
          这一日，不演别人的故事
          <br />
          良辰已定，静候君临
        </p>
      </div>
      <a className="scroll-cue" href="#dateSection" aria-label="继续浏览">
        <span>展卷</span>
        <i />
      </a>
    </header>
  );
}
