'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { useToast } from '@/components/shared/Toast';
import { createTicketNumber } from '@/lib/wedding';
import type { RsvpFormValues, TicketData } from './types';

interface RsvpSectionProps {
  formData: RsvpFormValues;
  onFormDataChange: (data: RsvpFormValues) => void;
  hasRegistered: boolean;
  onSubmitSuccess: (ticket: TicketData) => void;
  onViewTicket: () => void;
}

export function RsvpSection({ formData, onFormDataChange, hasRegistered, onSubmitSuccess, onViewTicket }: RsvpSectionProps) {
  const { ref, isVisible } = useReveal<HTMLElement>();
  const showToast = useToast();
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    onFormDataChange({ ...formData, [name]: value });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
      showToast('专属电子票已生成');
    } catch (error) {
      showToast(error instanceof Error ? error.message : '登记暂未成功，请稍后再试');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section ref={ref} className={`content-section rsvp-section section-reveal${isVisible ? ' is-visible' : ''}`}>
      <p className="section-kicker">肆 · 取票</p>
      <h2 className="section-title">领取入场券</h2>
      <p className="section-subtitle">本场没有普通观众，每一位到场的人都是我们故事的见证者</p>
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
            <select name="guests" value={formData.guests} onChange={handleChange}>
              <option>1 位</option>
              <option>2 位</option>
              <option>3 位</option>
              <option>4 位</option>
            </select>
          </label>
        </div>
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
        <button className="submit-button" type="submit" disabled={submitting}>
          {submitting ? '正 在 登 记' : '领 取 专 属 电 子 票'}
        </button>
      </form>
      <p className="ticket-exchange-note">婚礼当天凭电子票换取双联纪念票：一联由您珍藏，一联写下祝福留给新人。</p>
      {hasRegistered && <p className="rsvp-success">入场券已为您留好，静候相见。</p>}
      {hasRegistered && (
        <button className="view-ticket-button" type="button" onClick={onViewTicket}>
          查看我的电子票
        </button>
      )}
    </section>
  );
}
