'use client';

import { useEffect, useState } from 'react';

export interface CountdownValue {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  reached: boolean;
}

const PLACEHOLDER: CountdownValue = { days: '000', hours: '00', minutes: '00', seconds: '00', reached: false };

function computeCountdown(targetTime: number): CountdownValue {
  const difference = Math.max(0, targetTime - Date.now());
  const days = Math.floor(difference / 86400000);
  const hours = Math.floor((difference / 3600000) % 24);
  const minutes = Math.floor((difference / 60000) % 60);
  const seconds = Math.floor((difference / 1000) % 60);
  return {
    days: String(days).padStart(3, '0'),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
    reached: difference === 0
  };
}

// 初始值固定为占位符，真实数值只在客户端 effect 里计算，
// 避免服务端渲染时间与客户端 hydration 时间不一致导致的 hydration mismatch。
export function useCountdown(targetDate: string): CountdownValue {
  const [value, setValue] = useState<CountdownValue>(PLACEHOLDER);

  useEffect(() => {
    const targetTime = new Date(targetDate).getTime();
    setValue(computeCountdown(targetTime));
    const timer = setInterval(() => {
      setValue(computeCountdown(targetTime));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return value;
}
