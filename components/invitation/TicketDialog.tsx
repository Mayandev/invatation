'use client';

import { useMemo, type RefObject } from 'react';
import { Icon } from '@/components/shared/Icon';
import { formatNumericDate, wedding } from '@/lib/wedding';
import type { TicketData } from './types';

interface TicketDialogProps {
  dialogRef: RefObject<HTMLDialogElement | null>;
  ticket: TicketData | null;
  onClose: () => void;
}

export function TicketDialog({ dialogRef, ticket, onClose }: TicketDialogProps) {
  const attending = ticket?.attendance !== 'no';
  const guestName = ticket?.name || '亲爱的宾客';
  const ticketNumber = ticket?.ticketNumber || '';

  const guideUrl = useMemo(() => {
    if (!ticket || typeof window === 'undefined') return '';
    const query = new URLSearchParams({ ticket: ticket.ticketNumber, guest: ticket.name || '亲爱的宾客' });
    return `${window.location.origin}/guide?${query.toString()}`;
  }, [ticket]);

  return (
    <dialog className="ticket-dialog" id="ticketDialog" ref={dialogRef} onClose={onClose}>
      <button className="dialog-close ticket-close" id="closeTicket" type="button" aria-label="关闭电子票" onClick={onClose}>
        <Icon name="close" />
      </button>
      <p className="ticket-dialog__eyebrow">WEDDING ADMISSION</p>
      <article className="e-ticket" id="electronicTicket">
        <div className="e-ticket__main">
          <div className="e-ticket__show-mark">Z&amp;S</div>
          <p className="e-ticket__limited">ONE DAY · ONE LOVE · ONE STORY</p>
          <h2>BE OUR GUEST</h2>
          <p className="e-ticket__couple">
            <span>{wedding.groom}</span> <i>&amp;</i> <span>{wedding.bride}</span>
          </p>
          <div className="e-ticket__facts">
            <div>
              <span>特邀观众</span>
              <b id="ticketGuest">{guestName}</b>
            </div>
            <div>
              <span>席位</span>
              <b id="ticketSeat">{attending ? '待引座官确认' : '云端特别席'}</b>
            </div>
            <div>
              <span>演出日期</span>
              <b id="ticketDate">{formatNumericDate(wedding.date)}</b>
            </div>
            <div>
              <span>入场 / 开演</span>
              <b>11:18 / 11:58</b>
            </div>
          </div>
          <p className="e-ticket__venue">
            <span>{wedding.city}</span> · <span>{wedding.venue}</span>
          </p>
        </div>
        <div className="e-ticket__tear" aria-hidden="true">
          <span />
        </div>
        <div className="e-ticket__stub">
          {/* 二维码是内部接口按请求实时生成的矢量 SVG，无需也无法走 next/image 的栅格优化管线 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {guideUrl && <img id="ticketQr" alt="查看婚礼座位与路线的二维码" src={`/api/ticket-qr?text=${encodeURIComponent(guideUrl)}`} />}
          <div>
            <span>嘉宾票号</span>
            <b id="ticketNumber">{ticketNumber}</b>
          </div>
        </div>
      </article>
      <p className="ticket-dialog__note">
        请使用手机截图保存电子票，以便婚礼当天出示。现场验票后，可换取纸质双联纪念票。
      </p>
      <a className="ticket-guide-link" id="guideLink" href={guideUrl || '/guide'}>
        您的 AI 引座官
      </a>
    </dialog>
  );
}
