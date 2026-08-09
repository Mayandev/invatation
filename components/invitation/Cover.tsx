'use client';

import { wedding, formatNumericDate } from '@/lib/wedding';

interface CoverProps {
  isOpening: boolean;
  isHidden: boolean;
  onOpen: () => void;
}

export function Cover({ isOpening, isHidden, onOpen }: CoverProps) {
  return (
    <section
      className={`cover${isOpening ? ' is-opening' : ''}`}
      id="cover"
      aria-label="请柬封面"
      hidden={isHidden}
    >
      <div className="cover__photo" aria-hidden="true" />
      <div className="cover__shade" aria-hidden="true" />
      <header className="cover__masthead">
        <span>WEDDING INVITATION</span>
        <span>JI&apos;AN · 2026</span>
      </header>
      <div className="cover__headline">
        <p>THE WEDDING OF</p>
        <h1>明远 <i>&amp;</i> 佳玮</h1>
        <p className="cover__english">MINGYUAN &amp; JIAWEI</p>
      </div>
      <div className="cover__bottom">
        <div className="cover__facts">
          <span>{formatNumericDate(wedding.date)}</span>
          <span>11:58 AM</span>
          <span>{wedding.city}</span>
        </div>
        <button className="seal-button" id="openInvitation" type="button" onClick={onOpen}>
          <span>OPEN INVITATION</span>
          <i aria-hidden="true">↗</i>
        </button>
      </div>
    </section>
  );
}
