'use client';

import { useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Icon } from '@/components/shared/Icon';
import { getGuideAnswer, QUICK_QUESTIONS } from '@/lib/guide-answers';

interface ChatMessage {
  id: number;
  type: 'guest' | 'guide';
  text: string;
}

let nextMessageId = 0;

export function GuideChat() {
  const searchParams = useSearchParams();
  const guest = searchParams.get('guest') || '亲爱的宾客';

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  function scrollToEnd() {
    requestAnimationFrame(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }));
  }

  function ask(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { id: nextMessageId++, type: 'guest', text: trimmed }]);
    scrollToEnd();
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: nextMessageId++, type: 'guide', text: getGuideAnswer(trimmed) }]);
      scrollToEnd();
    }, 260);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    ask(question);
    setQuestion('');
  }

  return (
    <>
      <header className="guide-header">
        <Link href="/" aria-label="返回请柬">
          <Icon name="arrow-left" />
        </Link>
        <div>
          <p>婚礼小助手</p>
          <small>明远 &amp; 佳玮</small>
        </div>
        <time>10.06</time>
      </header>

      <main className="guide-main">
        {/* <section className="guide-photo" aria-label="明远与佳玮的婚纱照">
          <div>
            <b>邹明远 &amp; 孙佳玮</b>
            <span>2026年10月6日 · 吉安</span>
          </div>
        </section>

        <section className="guide-ticket">
          <div>
            <span>为你保留</span>
            <b id="guideGuest">{guest}</b>
          </div>
          <small id="guideTicket">电子票号：{ticket}</small>
        </section> */}

        <section className="chat" id="chat" aria-live="polite">
          <div className="message message--guide">
            <div className="message__body">
              <span className="message__name">引座官</span>
              <p id="welcomeMessage">{`${guest}，你好。座位、时间、地点或现场路线，都可以在这里问我。`}</p>
            </div>
          </div>
          {messages.map((message) => (
            <div className={`message message--${message.type}`} key={message.id}>
              <div className="message__body">
                {message.type === 'guide' && <span className="message__name">引座官</span>}
                <p>{message.text}</p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </section>

        <section className="quick-actions" aria-label="快捷问题">
          <h2>你可能想问</h2>
          {QUICK_QUESTIONS.map((item) => (
            <button key={item.question} type="button" onClick={() => ask(item.question)}>
              {item.label}
            </button>
          ))}
        </section>
      </main>

      <form className="chat-input" id="chatForm" onSubmit={handleSubmit}>
        <input
          id="chatQuestion"
          aria-label="向引座官提问"
          placeholder="想知道什么，直接问我…"
          autoComplete="off"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
        />
        <button type="submit">询问</button>
      </form>
    </>
  );
}
