'use client';

import { useReveal } from '@/hooks/useReveal';

const TIMELINE = [
  { time: '11:18', title: '欢迎抵达', note: '签到 · 留影 · 与我们见面' },
  { time: '11:58', title: '嘉礼仪式', note: '入礼 · 行礼 · 礼成' },
  { time: '12:28', title: '午宴开席', note: '举杯 · 用餐 · 尽兴相聚' }
];

export function ScheduleSection() {
  const { ref, isVisible } = useReveal<HTMLElement>();

  return (
    <section ref={ref} className={`content-section schedule-section section-reveal${isVisible ? ' is-visible' : ''}`}>
      <figure className="schedule-photo schedule-photo--pair">
        <div className="schedule-photo__panel schedule-photo__panel--bride">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/wedding-photos/selected-pair-bride-v2.webp" alt="佳玮把花束递向明远" />
        </div>
        <div className="schedule-photo__panel schedule-photo__panel--groom">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/wedding-photos/selected-schedule-v2.webp" alt="明远接住佳玮递来的花束" />
        </div>
      </figure>
      <p className="section-kicker">02 / THE SCHEDULE</p>
      <h2 className="section-title">我们的<br />婚礼日程</h2>
      <div className="timeline">
        {TIMELINE.map((item) => (
          <div className="timeline__item" key={item.time}>
            <time>{item.time}</time>
            <i />
            <div>
              <b>{item.title}</b>
              <span>{item.note}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
