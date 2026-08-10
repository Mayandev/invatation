'use client';

import { useLayoutEffect, useRef } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { Icon } from '@/components/shared/Icon';
import { wedding } from '@/lib/wedding';

export function Hero() {
  const { ref, isVisible } = useReveal<HTMLElement>();
  const titleRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const title = titleRef.current;
    if (!title) return;

    const fitTitle = () => {
      const availableWidth = title.clientWidth - 8;
      const contentWidth = title.scrollWidth;
      const scale = contentWidth > availableWidth ? availableWidth / contentWidth : 1;
      title.style.setProperty('--hero-title-scale', String(Math.max(0.1, scale)));
    };

    fitTitle();
    const resizeObserver = new ResizeObserver(fitTitle);
    resizeObserver.observe(title);
    void document.fonts.ready.then(fitTitle);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <header ref={ref} className={`hero section-reveal${isVisible ? ' is-visible' : ''}`}>
      <div className="hero__masthead">
        <span>VOL. 01</span>
        <span>A LOVE STORY</span>
      </div>
      <div className="hero__content">
        <p className="eyebrow">SAVE THE DATE · 06 OCT 2026</p>
        <h2 ref={titleRef}>
          <span className="hero__name">{wedding.groom}</span>
          <b>&amp;</b>
          <span className="hero__name">{wedding.bride}</span>
        </h2>
        <figure className="hero__portrait">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/wedding-photos/selected-hero-v2.webp" alt="戴着墨镜的明远与佳玮" />
          <figcaption>
            <span>TOGETHER, ALWAYS.</span>
            <span>PHOTOGRAPHED IN 2026</span>
          </figcaption>
        </figure>
        <p className="hero__verse">我们决定，把往后每一个普通日子<br></br>过成两个人共同的作品</p>
      </div>
      <a className="scroll-cue" href="#dateSection" aria-label="继续浏览">
        <span>SCROLL TO DISCOVER</span>
        <Icon name="arrow-down" />
      </a>
    </header>
  );
}
