'use client';

import { wedding, formatWeddingDate } from '@/lib/wedding';

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
      <div className="cover__wash" aria-hidden="true" />
      <div className="corner corner--top-left" aria-hidden="true" />
      <div className="corner corner--bottom-right" aria-hidden="true" />
      <div className="cover__inner">
        <p className="cover__year">丙午年 · 金秋吉日</p>
        <div className="double-happiness" aria-label="囍">
          囍
        </div>
        <p className="eyebrow">谨 备 喜 筵 · 恭 候 光 临</p>
        <h1>
          吾有嘉礼
          <br />
          敬邀君至
        </h1>
        <div className="couple" aria-label="新人姓名">
          <span>{wedding.groom}</span>
          <i>囍</i>
          <span>{wedding.bride}</span>
        </div>
        <p className="cover__date">{formatWeddingDate(wedding.date)}</p>
        <button className="seal-button" id="openInvitation" type="button" onClick={onOpen}>
          <span>启 阅 喜 帖</span>
        </button>
        <p className="cover__hint">轻触开启 · 共赴良辰</p>
      </div>
    </section>
  );
}
