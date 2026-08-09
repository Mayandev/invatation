'use client';

import { useReveal } from '@/hooks/useReveal';
import { useToast } from '@/components/shared/Toast';
import { wedding } from '@/lib/wedding';

export function LocationSection() {
  const { ref, isVisible } = useReveal<HTMLElement>();
  const showToast = useToast();
  const amapUrl = 'https://surl.amap.com/1Y9aqDU1c6Yu';
  const baiduUrl = 'https://j.map.baidu.com/e0/jtLh';

  async function handleCopyAddress() {
    try {
      await navigator.clipboard.writeText(wedding.address);
      showToast('宴址已复制');
    } catch {
      showToast(wedding.address);
    }
  }

  return (
    <section ref={ref} className={`content-section location-section section-reveal${isVisible ? ' is-visible' : ''}`}>
      <p className="section-kicker">03 / THE PLACE</p>
      <h2 className="section-title">在金秋<br />等你赴约</h2>
      <div className="venue-card">
        <p className="venue-card__city">JI&apos;AN · {wedding.city}</p>
        <h3>{wedding.venue}</h3>
        <p>{wedding.address}</p>
        <div className="map-actions" aria-label="地图与地址操作">
          <a className="map-link" href={amapUrl} target="_blank" rel="noreferrer" aria-label="使用高德地图打开宴会地址">
            高德导航 ↗
          </a>
          <a className="map-link" href={baiduUrl} target="_blank" rel="noreferrer" aria-label="使用百度地图打开宴会地址">
            百度导航 ↗
          </a>
          <button className="text-button map-copy" id="copyAddress" type="button" onClick={handleCopyAddress}>
            复制宴址
          </button>
        </div>
      </div>
    </section>
  );
}
