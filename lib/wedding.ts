export interface WeddingInfo {
  groom: string;
  bride: string;
  date: string;
  venue: string;
  address: string;
  city: string;
}

export const wedding: WeddingInfo = {
  groom: '邹明远',
  bride: '孙佳玮',
  date: '2026-10-06T11:58:00+08:00',
  venue: '悦宴楼五楼',
  address: '江西省吉安市悦宴楼（吾悦广场店）',
  city: '吉安'
};

// 9 月 15 日当天仍可提交，上海时间 9 月 16 日零点起关闭回执。
export const RSVP_CLOSE_AT = '2026-09-16T00:00:00+08:00';
export const RSVP_DEADLINE_LABEL = '2026年9月15日 23:59';

export function isRsvpClosed(now = new Date()): boolean {
  return now.getTime() >= new Date(RSVP_CLOSE_AT).getTime();
}

const DIGIT_MAP = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
const NUMBER_MAP = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

export function chineseDigits(value: number | string): string {
  return String(value)
    .split('')
    .map((digit) => DIGIT_MAP[Number(digit)])
    .join('');
}

export function chineseNumber(value: number): string {
  if (value < 10) return NUMBER_MAP[value];
  if (value === 10) return '十';
  if (value < 20) return `十${NUMBER_MAP[value - 10]}`;
  return `${NUMBER_MAP[Math.floor(value / 10)]}十${NUMBER_MAP[value % 10]}`;
}

export function formatWeddingDate(value: string): string {
  const date = new Date(value);
  return `${chineseDigits(date.getFullYear())}年${chineseNumber(date.getMonth() + 1)}月${chineseNumber(date.getDate())}日`;
}

export function formatNumericDate(value: string): string {
  const date = new Date(value);
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join(
    '.'
  );
}

export function createTicketNumber(): string {
  const bytes = new Uint8Array(4);
  if (typeof globalThis.crypto?.getRandomValues === 'function') {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }
  const randomCode = Array.from(bytes, (value) => value.toString(16).padStart(2, '0')).join('').toUpperCase();
  return `共赴-1006-${randomCode.slice(0, 4)}-${randomCode.slice(4)}`;
}

export interface WeddingDisplayValues extends WeddingInfo {
  dateLong: string;
  monthEn: string;
  monthNumber: string;
  dayNumber: string;
  weekday: string;
}

export function getWeddingDisplayValues(info: WeddingInfo = wedding): WeddingDisplayValues {
  const date = new Date(info.date);
  return {
    ...info,
    dateLong: formatWeddingDate(info.date),
    monthEn: `${date.getMonth() + 1}月`,
    monthNumber: String(date.getMonth() + 1).padStart(2, '0'),
    dayNumber: String(date.getDate()).padStart(2, '0'),
    weekday: `星期${'日一二三四五六'[date.getDay()]}`
  };
}
