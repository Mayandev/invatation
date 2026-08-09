'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
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
import { ThanksDialog } from './ThanksDialog';
import { DEFAULT_RSVP_FORM_VALUES, type RsvpFormValues, type TicketData } from './types';

const STORAGE_KEY = 'wedding-rsvp';

interface InvitationAppProps {
  guest: string;
}

export function InvitationApp({ guest }: InvitationAppProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [coverHidden, setCoverHidden] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [hasMusicStarted, setHasMusicStarted] = useState(false);
  const [musicCurrentTime, setMusicCurrentTime] = useState(0);
  const [musicDuration, setMusicDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [formData, setFormData] = useState<RsvpFormValues>(() => ({
    ...DEFAULT_RSVP_FORM_VALUES,
    name: guest
  }));
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [responseAttendance, setResponseAttendance] = useState<'yes' | 'no' | null>(null);
  const ticketDialog = useDialog<HTMLDialogElement>();
  const thanksDialog = useDialog<HTMLDialogElement>();

  // 封面覆盖全屏时锁定页面滚动，开启后恢复；对齐原 body.cover-active 行为。
  useLayoutEffect(() => {
    if (!isOpening) window.scrollTo(0, 0);
    document.documentElement.classList.toggle('cover-active', !isOpening);
    document.body.classList.toggle('cover-active', !isOpening);
    return () => {
      document.documentElement.classList.remove('cover-active');
      document.body.classList.remove('cover-active');
    };
  }, [isOpening]);

  useEffect(() => {
    if (!isOpening) return;
    const timer = setTimeout(() => setCoverHidden(true), 1450);
    return () => clearTimeout(timer);
  }, [isOpening]);

  const openInvitation = () => {
    setIsOpening(true);
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.volume = 0.38;
      void audio.play().catch(() => undefined);
    } else {
      audio.pause();
    }
  };

  const syncMusicProgress = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setMusicCurrentTime(audio.currentTime);
    setMusicDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
  };

  const seekMusic = (time: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;
    const nextTime = Math.min(Math.max(time, 0), audio.duration);
    audio.currentTime = nextTime;
    setMusicCurrentTime(nextTime);
  };

  // 恢复上次回执：赴约时恢复入场券，婉拒时只恢复祝福状态。
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') as
        | (Partial<TicketData> & RsvpFormValues)
        | null;
      if (!saved) return;
      const restored: TicketData = {
        name: saved.name || '',
        attendance: saved.attendance === 'no' ? 'no' : 'yes',
        guestSide: saved.guestSide === 'bride' ? 'bride' : 'groom',
        guests: saved.guests || DEFAULT_RSVP_FORM_VALUES.guests,
        message: saved.message || '',
        ticketNumber: saved.ticketNumber || createTicketNumber()
      };
      // localStorage 在服务端不可用，只能在挂载后的 effect 里读取并同步进 state。
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: restored.name,
        attendance: restored.attendance,
        guestSide: restored.guestSide,
        guests: restored.guests,
        message: restored.message
      });
      setResponseAttendance(restored.attendance);
      setTicket(restored.attendance === 'yes' ? restored : null);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(restored));
    } catch {
      // 忽略无效缓存
    }
  }, []);

  return (
    <ToastProvider>
      <div className="paper-noise" aria-hidden="true" />
      <audio
        ref={audioRef}
        src="/assets/audio/young-and-beautiful.mp3"
        preload="auto"
        loop
        onPlay={() => {
          setIsMusicPlaying(true);
          setHasMusicStarted(true);
        }}
        onPause={() => setIsMusicPlaying(false)}
        onLoadedMetadata={syncMusicProgress}
        onDurationChange={syncMusicProgress}
        onTimeUpdate={syncMusicProgress}
      />
      <Cover
        isOpening={isOpening}
        isHidden={coverHidden}
        isMusicPlaying={isMusicPlaying}
        hasMusicStarted={hasMusicStarted}
        musicCurrentTime={musicCurrentTime}
        musicDuration={musicDuration}
        onToggleMusic={toggleMusic}
        onSeekMusic={seekMusic}
        onOpen={openInvitation}
      />
      {coverHidden && (
        <button
          className={`music-toggle${isMusicPlaying ? ' is-playing' : ''}`}
          type="button"
          aria-label={isMusicPlaying ? '暂停背景音乐' : '播放背景音乐'}
          aria-pressed={isMusicPlaying}
          onClick={toggleMusic}
        >
          <span className="music-toggle__note" aria-hidden="true">♪</span>
          <span className="music-toggle__state" aria-hidden="true">{isMusicPlaying ? 'ON' : 'OFF'}</span>
        </button>
      )}
      <main className={`invitation${isOpening ? ' is-open' : ''}`} id="invitation" aria-hidden={!isOpening}>
        <Hero />
        <DateSection />
        <ScheduleSection />
        <LocationSection />
        <RsvpSection
          formData={formData}
          onFormDataChange={setFormData}
          responseAttendance={responseAttendance}
          onSubmitSuccess={(nextTicket) => {
            setResponseAttendance(nextTicket.attendance);
            if (nextTicket.attendance === 'no') {
              setTicket(null);
              thanksDialog.open();
              return;
            }
            setTicket(nextTicket);
            ticketDialog.open();
          }}
          onViewTicket={ticketDialog.open}
        />
        <Footer />
      </main>
      <TicketDialog dialogRef={ticketDialog.ref} ticket={ticket} onClose={ticketDialog.close} />
      <ThanksDialog dialogRef={thanksDialog.ref} onClose={thanksDialog.close} />
    </ToastProvider>
  );
}
