'use client';

import { useCountdown } from '@/hooks/useCountdown';
import { useReveal } from '@/hooks/useReveal';
import { Icon } from '@/components/shared/Icon';
import { getWeddingDisplayValues, wedding } from '@/lib/wedding';

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

function getMonthCells(dateValue: string): { cells: Array<number | null>; weddingDay: number; year: number; month: number } {
  const [year, month, weddingDay] = dateValue.split('T')[0].split('-').map(Number);
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells = [
    ...Array<null>(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1)
  ];

  return { cells, weddingDay, year, month };
}

export function DateSection() {
  const { ref, isVisible } = useReveal<HTMLElement>();
  const countdown = useCountdown(wedding.date);
  const values = getWeddingDisplayValues();
  const calendar = getMonthCells(wedding.date);

  return (
    <section
      ref={ref}
      className={`content-section date-section section-reveal${isVisible ? ' is-visible' : ''}`}
      id="dateSection"
    >
      <p className="section-kicker">01 / THE DATE</p>
      <h2 className="section-title">这一天<br />留给我们</h2>
      <p className="section-subtitle">择一日相见，把爱与喜悦分享给最重要的你</p>

      <div className="calendar-card">
        <div className="calendar-card__heading">
          <p>{calendar.year}年{calendar.month}月</p>
          <span>OCTOBER</span>
        </div>
        <div className="calendar-card__weekdays" role="row" aria-label="星期">
          {WEEKDAYS.map((weekday) => <span key={weekday}>{weekday}</span>)}
        </div>
        <div className="calendar-card__grid" role="grid" aria-label={`${calendar.year}年${calendar.month}月日历`}>
          {calendar.cells.map((day, index) => (
            <span
              className={`calendar-card__day${day === calendar.weddingDay ? ' is-wedding' : ''}${day ? '' : ' is-empty'}`}
              key={`${day ?? 'empty'}-${index}`}
              role="gridcell"
              aria-label={day === calendar.weddingDay ? `${calendar.month}月${day}日，婚礼当天` : day ? `${calendar.month}月${day}日` : undefined}
              aria-current={day === calendar.weddingDay ? 'date' : undefined}
            >
              {day}
            </span>
          ))}
        </div>
        <p className="calendar-card__wedding">10月6日 · {values.weekday} · 11:58</p>
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
    </section>
  );
}
