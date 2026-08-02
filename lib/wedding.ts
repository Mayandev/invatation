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
  address: '江西省吉安市悦宴楼五楼',
  city: '吉安'
};

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
  return '共赴-1006-0402-1010';
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
