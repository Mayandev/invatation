'use client';

import { useReveal } from '@/hooks/useReveal';
import { useToast } from '@/components/shared/Toast';
import { wedding } from '@/lib/wedding';

export function LocationSection() {
  const { ref, isVisible } = useReveal<HTMLElement>();
  const showToast = useToast();
  const encodedAddress = encodeURIComponent(`${wedding.address} ${wedding.venue}`);
  const encodedCity = encodeURIComponent(wedding.city);
  const amapUrl = `https://uri.amap.com/search?keyword=${encodedAddress}&city=${encodedCity}&src=wedding-invitation&callnative=1`;
  const baiduUrl = `https://api.map.baidu.com/geocoder?address=${encodedAddress}&output=html&src=webapp.wedding.invitation`;

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
      <p className="section-kicker">叁 · 雅集</p>
      <h2 className="section-title">静候君临</h2>
      <div className="venue-card">
        <div className="venue-card__pin" aria-hidden="true">
          <span />
        </div>
        <p className="venue-card__city">{wedding.city}</p>
        <h3>{wedding.venue}</h3>
        <p>{wedding.address}</p>
        <div className="map-actions" aria-label="地图与地址操作">
          <a className="map-link" href={amapUrl} target="_blank" rel="noreferrer" aria-label="使用高德地图打开宴会地址">
            高德地图
          </a>
          <a className="map-link" href={baiduUrl} target="_blank" rel="noreferrer" aria-label="使用百度地图打开宴会地址">
            百度地图
          </a>
          <button className="text-button map-copy" id="copyAddress" type="button" onClick={handleCopyAddress}>
            复制宴址
          </button>
        </div>
      </div>
    </section>
  );
}
