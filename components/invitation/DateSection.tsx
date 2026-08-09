'use client';

import { useCountdown } from '@/hooks/useCountdown';
import { useReveal } from '@/hooks/useReveal';
import { getWeddingDisplayValues, wedding } from '@/lib/wedding';

export function DateSection() {
  const { ref, isVisible } = useReveal<HTMLElement>();
  const countdown = useCountdown(wedding.date);
  const values = getWeddingDisplayValues();

  return (
    <section
      ref={ref}
      className={`content-section date-section section-reveal${isVisible ? ' is-visible' : ''}`}
      id="dateSection"
    >
      <p className="section-kicker">01 / THE DATE</p>
      <h2 className="section-title">这一天<br />留给我们</h2>
      <p className="section-subtitle">择一日相见，把爱与喜悦分享给最重要的人。</p>

      <div className="calendar-card">
        <p className="calendar-card__month">OCTOBER · {values.monthEn}</p>
        <div className="calendar-card__date">
          <span>2026</span>
          <b>{values.dayNumber}</b>
          <span>{values.weekday}</span>
        </div>
        <p>{values.dateLong}</p>
      </div>

      <p className="countdown-note">{countdown.reached ? 'TODAY IS THE DAY' : 'COUNTING DOWN TO US'}</p>
      <div className="countdown" aria-label="婚礼倒计时">
        <div>
          <b id="days">{countdown.days}</b>
          <span>天</span>
        </div>
        <div>
          <b id="hours">{countdown.hours}</b>
          <span>时</span>
        </div>
        <div>
          <b id="minutes">{countdown.minutes}</b>
          <span>分</span>
        </div>
        <div>
          <b id="seconds">{countdown.seconds}</b>
          <span>秒</span>
        </div>
      </div>
      <a className="calendar-button" href="/api/calendar" aria-label="将婚礼添加到系统日历">
        SAVE TO CALENDAR ↗
      </a>
      <p className="calendar-hint">
        若未自动打开日历，请点击微信右上角，选择“在浏览器中打开”，再点击添加到日历。
      </p>
    </section>
  );
}
