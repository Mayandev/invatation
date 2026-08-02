'use client';

import { useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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
  const ticket = searchParams.get('ticket') || '尚未取票';

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
          ‹
        </Link>
        <div>
          <span className="guide-status" />
          <p>智能引座官</p>
          <small>《共赴》一生限定场</small>
        </div>
        <i>囍</i>
      </header>

      <main className="guide-main">
        <section className="guide-ticket">
          <span>特邀观众</span>
          <b id="guideGuest">{guest}</b>
          <small id="guideTicket">嘉宾票 · {ticket}</small>
        </section>

        <section className="chat" id="chat" aria-live="polite">
          <div className="message message--guide">
            <span className="message__avatar">囍</span>
            <p id="welcomeMessage">{`${guest}，欢迎来到《共赴》一生限定场。我是今日引座官，可以帮您查询席位、节目单与场馆信息。`}</p>
          </div>
          {messages.map((message) => (
            <div className={`message message--${message.type}`} key={message.id}>
              {message.type === 'guide' && <span className="message__avatar">囍</span>}
              <p>{message.text}</p>
            </div>
          ))}
          <div ref={chatEndRef} />
        </section>

        <section className="quick-actions" aria-label="快捷问题">
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
          placeholder="问问座位、流程或场馆信息…"
          autoComplete="off"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
        />
        <button type="submit">发送</button>
      </form>
    </>
  );
}
