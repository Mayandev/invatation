'use client';

import { useEffect, useLayoutEffect, useState } from 'react';
import { ToastProvider } from '@/components/shared/Toast';
import { useDialog } from '@/hooks/useDialog';
import { createTicketNumber } from '@/lib/wedding';
import { Cover } from './Cover';
import { DateSection } from './DateSection';
import { Footer } from './Footer';
import { Hero } from './Hero';
import { LocationSection } from './LocationSection';
import { RsvpSection } from './RsvpSection';
import { ScheduleSection } from './ScheduleSection';
import { TicketDialog } from './TicketDialog';
import { DEFAULT_RSVP_FORM_VALUES, type RsvpFormValues, type TicketData } from './types';

const STORAGE_KEY = 'wedding-rsvp';

export function InvitationApp() {
  const [isOpening, setIsOpening] = useState(false);
  const [coverHidden, setCoverHidden] = useState(false);
  const [formData, setFormData] = useState<RsvpFormValues>(DEFAULT_RSVP_FORM_VALUES);
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const dialog = useDialog<HTMLDialogElement>();

  // 封面覆盖全屏时锁定页面滚动，开启后恢复；对齐原 body.cover-active 行为。
  useLayoutEffect(() => {
    document.body.classList.toggle('cover-active', !isOpening);
    return () => document.body.classList.remove('cover-active');
  }, [isOpening]);

  useEffect(() => {
    if (!isOpening) return;
    const timer = setTimeout(() => setCoverHidden(true), 1100);
    return () => clearTimeout(timer);
  }, [isOpening]);

  // 恢复上次登记信息，回填表单并直接生成入场券（不自动弹出对话框）。
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') as
        | (Partial<TicketData> & RsvpFormValues)
        | null;
      if (!saved) return;
      const restored: TicketData = {
        name: saved.name || '',
        attendance: saved.attendance === 'no' ? 'no' : 'yes',
        guests: saved.guests || DEFAULT_RSVP_FORM_VALUES.guests,
        message: saved.message || '',
        ticketNumber: saved.ticketNumber || createTicketNumber()
      };
      setFormData({ name: restored.name, attendance: restored.attendance, guests: restored.guests, message: restored.message });
      setTicket(restored);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(restored));
    } catch {
      // 忽略无效缓存
    }
  }, []);

  return (
    <ToastProvider>
      <div className="paper-noise" aria-hidden="true" />
      <Cover isOpening={isOpening} isHidden={coverHidden} onOpen={() => setIsOpening(true)} />
      <main className="invitation" id="invitation" aria-hidden={!isOpening}>
        <Hero />
        <DateSection />
        <ScheduleSection />
        <LocationSection />
        <RsvpSection
          formData={formData}
          onFormDataChange={setFormData}
          hasRegistered={ticket !== null}
          onSubmitSuccess={(nextTicket) => {
            setTicket(nextTicket);
            dialog.open();
          }}
          onViewTicket={dialog.open}
        />
        <Footer />
      </main>
      <TicketDialog dialogRef={dialog.ref} ticket={ticket} onClose={dialog.close} />
    </ToastProvider>
  );
}
