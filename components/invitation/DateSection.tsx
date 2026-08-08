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
      <p className="section-kicker">壹 · 良辰</p>
      <h2 className="section-title">佳期已定</h2>
      <p className="section-subtitle">既许一人以偏爱，愿尽余生之慷慨</p>

      <div className="calendar-card">
        <p className="calendar-card__month">{values.monthEn}</p>
        <div className="calendar-card__date">
          <span>{values.monthNumber}</span>
          <b>{values.dayNumber}</b>
          <span>{values.weekday}</span>
        </div>
        <p>{values.dateLong}</p>
      </div>

      <p className="countdown-note">{countdown.reached ? '良辰已至 · 恭迎赴宴' : '距离良辰还有'}</p>
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
        <span aria-hidden="true">日</span>
        添加到日历
      </a>
    </section>
  );
}
