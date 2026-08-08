import { wedding } from '@/lib/wedding';

function toIcsUtc(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

function escapeIcs(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
}

export function GET() {
  const ceremonyStart = new Date(wedding.date);
  const guestArrival = new Date(ceremonyStart.getTime() - 40 * 60 * 1000);
  const eventEnd = new Date(ceremonyStart.getTime() + 3 * 60 * 60 * 1000);
  const uid = `wedding-${ceremonyStart.getTime()}@invitation`;
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wedding Invitation//ZH-CN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${toIcsUtc(new Date())}`,
    `DTSTART:${toIcsUtc(guestArrival)}`,
    `DTEND:${toIcsUtc(eventEnd)}`,
    `SUMMARY:${escapeIcs(`${wedding.groom}与${wedding.bride}的婚礼`)}`,
    `LOCATION:${escapeIcs(`${wedding.venue}，${wedding.address}`)}`,
    `DESCRIPTION:${escapeIcs(`11:18 恭迎宾客\n11:58 嘉礼初成\n12:28 喜宴开席`)}`,
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    'DESCRIPTION:明日共赴嘉礼',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ];

  return new Response(`${lines.join('\r\n')}\r\n`, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="wedding-invitation.ics"',
      'Cache-Control': 'public, max-age=86400'
    }
  });
}
