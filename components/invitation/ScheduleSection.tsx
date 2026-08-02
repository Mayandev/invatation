'use client';

import { useReveal } from '@/hooks/useReveal';

const TIMELINE = [
  { time: '11:18', title: '恭迎宾客', note: '奉茶 · 签到 · 留影' },
  { time: '11:58', title: '嘉礼初成', note: '见证 · 执手 · 礼成' },
  { time: '12:28', title: '喜宴开席', note: '举杯 · 同欢 · 共叙' }
];

export function ScheduleSection() {
  const { ref, isVisible } = useReveal<HTMLElement>();

  return (
    <section ref={ref} className={`content-section schedule-section section-reveal${isVisible ? ' is-visible' : ''}`}>
      <p className="section-kicker">贰 · 节目单</p>
      <h2 className="section-title">一生限定场</h2>
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
