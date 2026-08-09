'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { useToast } from '@/components/shared/Toast';
import { createTicketNumber, RSVP_DEADLINE_LABEL, isRsvpClosed } from '@/lib/wedding';
import type { RsvpFormValues, TicketData } from './types';

interface RsvpSectionProps {
  formData: RsvpFormValues;
  onFormDataChange: (data: RsvpFormValues) => void;
  responseAttendance: 'yes' | 'no' | null;
  onSubmitSuccess: (ticket: TicketData) => void;
  onViewTicket: () => void;
}

export function RsvpSection({
  formData,
  onFormDataChange,
  responseAttendance,
  onSubmitSuccess,
  onViewTicket
}: RsvpSectionProps) {
  const { ref, isVisible } = useReveal<HTMLElement>();
  const showToast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const isClosed = isRsvpClosed();

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    onFormDataChange({ ...formData, [name]: value });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isClosed) {
      showToast(`回执已于${RSVP_DEADLINE_LABEL}截止`);
      return;
    }
    setSubmitting(true);
    try {
      const ticket: TicketData = { ...formData, ticketNumber: createTicketNumber() };
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticket)
      });
      const raw = await response.text();
      let result: { error?: string } = {};
      try {
        result = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error('服务器响应异常，请稍后再试');
      }
      if (!response.ok) throw new Error(result.error || '登记失败');

      localStorage.setItem('wedding-rsvp', JSON.stringify(ticket));
      onSubmitSuccess(ticket);
      showToast(formData.attendance === 'no' ? '已收到您的祝福' : '专属电子票已生成');
    } catch (error) {
      showToast(error instanceof Error ? error.message : '登记暂未成功，请稍后再试');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section ref={ref} className={`content-section rsvp-section section-reveal${isVisible ? ' is-visible' : ''}`}>
      <p className="section-kicker">04 / BE OUR GUEST</p>
      <h2 className="section-title">期待与你<br />共同庆祝</h2>
      <p className="section-subtitle">你不是这场婚礼的观众，而是我们故事里重要的一页</p>
      <form className="rsvp-form" id="rsvpForm" onSubmit={handleSubmit}>
        <label>
          <span>宾客雅名</span>
          <input
            name="name"
            autoComplete="name"
            placeholder="如何称呼您"
            required
            value={formData.name}
            onChange={handleChange}
          />
        </label>
        <div className="form-row">
          <label>
            <span>是否赴宴</span>
            <select name="attendance" value={formData.attendance} onChange={handleChange}>
              <option value="yes">欣然赴约</option>
              <option value="no">遥寄祝福</option>
            </select>
          </label>
          <label>
            <span>赴宴人数</span>
            <select
              name="guests"
              value={formData.guests}
              onChange={handleChange}
              disabled={formData.attendance === 'no'}
            >
              <option>1 位</option>
              <option>2 位</option>
              <option>3 位</option>
              <option>4 位</option>
            </select>
          </label>
        </div>
        <label>
          <span>亲友关系</span>
          <select name="guestSide" value={formData.guestSide} onChange={handleChange}>
            <option value="groom">男方亲友</option>
            <option value="bride">女方亲友</option>
          </select>
        </label>
        <label>
          <span>留一笺祝福</span>
          <textarea
            name="message"
            rows={3}
            placeholder="写下您的祝福（选填）"
            value={formData.message}
            onChange={handleChange}
          />
        </label>
        <p className="rsvp-deadline">回执截止：{RSVP_DEADLINE_LABEL}</p>
        <button className="submit-button" type="submit" disabled={submitting || isClosed} aria-busy={submitting}>
          {submitting && <span className="submit-button__spinner" aria-hidden="true" />}
          <span className="submit-button__label">
            {isClosed
              ? '回执已截止'
              : submitting
                ? formData.attendance === 'no'
                  ? '正在送出祝福'
                  : '正在生成电子票'
                : formData.attendance === 'no'
                  ? '送出祝福'
                  : '领取专属电子票'}
          </span>
        </button>
      </form>
      {formData.attendance === 'yes' && (
        <p className="ticket-exchange-note">
          婚礼当天可凭电子票换取双联纪念票：一联由你珍藏，一联写下祝福留给我们。
        </p>
      )}
      {responseAttendance === 'yes' && <p className="rsvp-success">入场券已为您留好，静候相见。</p>}
      {responseAttendance === 'no' && <p className="rsvp-success">已收到您的祝福，谢谢您告知。</p>}
      {responseAttendance === 'yes' && (
        <button className="view-ticket-button" type="button" onClick={onViewTicket}>
          查看我的电子票
        </button>
      )}
    </section>
  );
}
