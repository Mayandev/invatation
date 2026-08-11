'use client';

import { useLayoutEffect, useMemo, useRef, type RefObject } from 'react';
import { Icon } from '@/components/shared/Icon';
import { formatNumericDate, wedding } from '@/lib/wedding';
import type { TicketData } from './types';

const RETURN_POSITION_KEY = 'wedding-invitation-return-position';

interface TicketDialogProps {
  dialogRef: RefObject<HTMLDialogElement | null>;
  ticket: TicketData | null;
  onClose: () => void;
}

export function TicketDialog({ dialogRef, ticket, onClose }: TicketDialogProps) {
  const attending = ticket?.attendance !== 'no';
  const guestName = ticket?.name || '亲爱的宾客';
  const ticketNumber = ticket?.ticketNumber || '';
  const ticketNumberRef = useRef<HTMLElement>(null);
  const ticketLimitedRef = useRef<HTMLSpanElement>(null);
  const ticketTitleRef = useRef<HTMLSpanElement>(null);

  const guideUrl = useMemo(() => {
    if (!ticket || typeof window === 'undefined') return '';
    const query = new URLSearchParams({ ticket: ticket.ticketNumber, guest: ticket.name || '亲爱的宾客' });
    return `${window.location.origin}/guide?${query.toString()}`;
  }, [ticket]);

  useLayoutEffect(() => {
    const number = ticketNumberRef.current;
    if (!number) return;

    const fitTicketNumber = () => {
      if (!number.clientWidth) return;
      const scale = number.scrollWidth > number.clientWidth
        ? number.clientWidth / number.scrollWidth
        : 1;
      number.style.setProperty('--ticket-number-scale', String(Math.max(0.1, scale)));
    };

    fitTicketNumber();
    const resizeObserver = new ResizeObserver(fitTicketNumber);
    resizeObserver.observe(number);
    void document.fonts.ready.then(fitTicketNumber);

    return () => resizeObserver.disconnect();
  }, [ticketNumber]);

  useLayoutEffect(() => {
    const copyNodes = [ticketLimitedRef.current, ticketTitleRef.current].filter(
      (node): node is HTMLSpanElement => node !== null,
    );
    if (!copyNodes.length) return;

    const fitTicketCopy = () => {
      copyNodes.forEach((node) => {
        const availableWidth = Math.max(0, (node.parentElement?.clientWidth || 0) - 2);
        const scale = node.offsetWidth > availableWidth
          ? availableWidth / node.offsetWidth
          : 1;
        node.style.setProperty('--ticket-copy-scale', String(Math.max(0.1, scale)));
      });
    };

    fitTicketCopy();
    const resizeObserver = new ResizeObserver(fitTicketCopy);
    copyNodes.forEach((node) => resizeObserver.observe(node.parentElement!));
    void document.fonts.ready.then(fitTicketCopy);

    return () => resizeObserver.disconnect();
  }, []);

  function rememberInvitationPosition() {
    const invitation = document.getElementById('invitation');
    if (!invitation) return;

    try {
      sessionStorage.setItem(RETURN_POSITION_KEY, JSON.stringify({
        scrollTop: invitation.scrollTop,
        pageIndex: Math.round(invitation.scrollTop / Math.max(invitation.clientHeight, 1))
      }));
    } catch {
      // 浏览器禁用会话存储时，仍可依赖原生历史记录返回。
    }
  }

  return (
    <dialog className="ticket-dialog" id="ticketDialog" ref={dialogRef} onClose={onClose}>
      <button className="dialog-close ticket-close" id="closeTicket" type="button" aria-label="关闭电子票" onClick={onClose}>
        <Icon name="close" />
      </button>
      <p className="ticket-dialog__eyebrow">WEDDING ADMISSION</p>
      <article className="e-ticket" id="electronicTicket">
        <div className="e-ticket__main">
          <div className="e-ticket__show-mark">Z&amp;S</div>
          <p className="e-ticket__limited"><span ref={ticketLimitedRef}>ONE DAY · ONE LOVE · ONE STORY</span></p>
          <h2><span ref={ticketTitleRef}>BE OUR GUEST</span></h2>
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
            <b id="ticketNumber" ref={ticketNumberRef}>{ticketNumber}</b>
          </div>
        </div>
      </article>
      <p className="ticket-dialog__note">
        请使用手机截图保存电子票，以便婚礼当天出示。现场验票后，可换取纸质双联纪念票。
      </p>
      <a className="ticket-guide-link" id="guideLink" href={guideUrl || '/guide'} onClick={rememberInvitationPosition}>
        您的 AI 引座官
      </a>
    </dialog>
  );
}
