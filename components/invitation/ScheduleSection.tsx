'use client';

import { useReveal } from '@/hooks/useReveal';

const TIMELINE = [
  { time: '11:18', title: '欢迎抵达', note: '签到 · 留影 · 与我们见面' },
  { time: '11:58', title: '婚礼仪式', note: '见证 · 誓言 · 交换戒指' },
  { time: '12:28', title: '午宴开席', note: '举杯 · 用餐 · 尽兴相聚' }
];

export function ScheduleSection() {
  const { ref, isVisible } = useReveal<HTMLElement>();

  return (
    <section ref={ref} className={`content-section schedule-section section-reveal${isVisible ? ' is-visible' : ''}`}>
      <figure className="schedule-photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/wedding-photos/editorial-wide.jpg" alt="戴着墨镜相视的明远与佳玮" />
        <figcaption>YOU, ME &amp; FOREVER</figcaption>
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
