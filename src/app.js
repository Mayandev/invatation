// Vite application entry.
const fallbackConfig = {
  wechatEnabled: false,
  wedding: {
    groom: '邹明远',
    bride: '孙佳玮',
    date: '2026-10-06T11:58:00+08:00',
    venue: '悦宴楼 5F',
    address: '江西省吉安市悦宴楼 5F',
    city: '吉安'
  }
};

const state = { config: fallbackConfig, user: null, isWechat: /MicroMessenger/i.test(navigator.userAgent) };
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const cover = $('#cover');
const invitation = $('#invitation');
const toast = $('#toast');
const params = new URLSearchParams(location.search);

function chineseDigits(value) {
  const map = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  return String(value).split('').map((digit) => map[Number(digit)]).join('');
}

function chineseNumber(value) {
  const map = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  if (value < 10) return map[value];
  if (value === 10) return '十';
  if (value < 20) return `十${map[value - 10]}`;
  return `${map[Math.floor(value / 10)]}十${map[value % 10]}`;
}

function formatWeddingDate(value) {
  const date = new Date(value);
  return `${chineseDigits(date.getFullYear())}年${chineseNumber(date.getMonth() + 1)}月${chineseNumber(date.getDate())}日`;
}

function formatNumericDate(value) {
  const date = new Date(value);
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('.');
}

function createTicketNumber() {
  return 'LOVE-1006-0402-1010';
}

function renderTicket(data) {
  const attending = data.attendance !== 'no';
  const ticketNumber = createTicketNumber();
  const guideUrl = new URL('/guide.html', location.origin);
  guideUrl.searchParams.set('ticket', ticketNumber);
  guideUrl.searchParams.set('guest', data.name || '亲爱的宾客');

  $('#ticketGuest').textContent = data.name || '亲爱的宾客';
  $('#ticketSeat').textContent = attending ? '待引座官确认' : '云端特别席';
  $('#ticketDate').textContent = formatNumericDate(state.config.wedding.date);
  $('#ticketNumber').textContent = ticketNumber;
  $('#guideLink').href = guideUrl.href;
  $('#ticketQr').src = `/api/ticket-qr?text=${encodeURIComponent(guideUrl.href)}`;
  return { ...data, ticketNumber };
}

function bindWeddingData() {
  const data = state.config.wedding;
  const date = new Date(data.date);
  const values = {
    ...data,
    dateLong: formatWeddingDate(data.date),
    monthEn: `${date.getMonth() + 1}月`,
    monthNumber: String(date.getMonth() + 1).padStart(2, '0'),
    dayNumber: String(date.getDate()).padStart(2, '0'),
    weekday: `星期${'日一二三四五六'[date.getDay()]}`
  };
  Object.entries(values).forEach(([key, value]) => {
    $$(`[data-bind="${key}"]`).forEach((element) => { element.textContent = value; });
  });
  document.title = `${data.groom} & ${data.bride} · 婚礼请柬`;
}

async function loadConfig() {
  try {
    const response = await fetch('/api/config', { credentials: 'same-origin' });
    if (response.ok) state.config = await response.json();
  } catch {
    state.config = fallbackConfig;
  }
  bindWeddingData();
  updateAuthCopy();
}

async function loadUser() {
  try {
    const response = await fetch('/api/me', { credentials: 'same-origin' });
    if (!response.ok) return;
    const data = await response.json();
    state.user = data.user;
    const greeting = $('#guestGreeting');
    greeting.textContent = `${state.user.nickname}，恭候您的光临`;
    greeting.hidden = false;
  } catch { /* 未登录时保持匿名 */ }
}

function updateAuthCopy() {
  const button = $('#openButtonText');
  const hint = $('#authHint');
  if (state.user) {
    button.textContent = '启 阅 喜 帖';
    hint.textContent = '已识君意 · 共赴良辰';
  } else if (state.config.wechatEnabled) {
    button.textContent = '微信授权 · 启阅';
    hint.textContent = state.isWechat ? '轻触授权 · 仅用于宾客称呼' : '请在微信内打开此请柬';
  } else {
    button.textContent = '启 阅 喜 帖';
    hint.textContent = '当前为预览模式 · 共赴良辰';
  }
}

function openInvitation() {
  cover.classList.add('is-opening');
  invitation.setAttribute('aria-hidden', 'false');
  document.body.classList.remove('cover-active');
  requestAnimationFrame(() => $('.hero').classList.add('is-visible'));
  setTimeout(() => { cover.hidden = true; }, 1100);
}

function handleOpen() {
  if (state.user || !state.config.wechatEnabled || params.get('preview') === '1') {
    openInvitation();
    return;
  }
  if (state.isWechat) {
    location.href = '/api/auth/wechat';
    return;
  }
  $('#wechatDialog').showModal();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.remove('is-visible'), 2200);
}

function startCountdown() {
  const target = new Date(state.config.wedding.date).getTime();
  const render = () => {
    const difference = Math.max(0, target - Date.now());
    const days = Math.floor(difference / 86400000);
    const hours = Math.floor((difference / 3600000) % 24);
    const minutes = Math.floor((difference / 60000) % 60);
    const seconds = Math.floor((difference / 1000) % 60);
    $('#days').textContent = String(days).padStart(3, '0');
    $('#hours').textContent = String(hours).padStart(2, '0');
    $('#minutes').textContent = String(minutes).padStart(2, '0');
    $('#seconds').textContent = String(seconds).padStart(2, '0');
    if (difference === 0) $('#countdownNote').textContent = '良辰已至 · 恭迎赴宴';
  };
  render();
  setInterval(render, 1000);
}

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .14 });
  $$('.section-reveal').forEach((section) => observer.observe(section));
}

function restoreRsvp() {
  try {
    const saved = JSON.parse(localStorage.getItem('wedding-rsvp'));
    if (!saved) return;
    Object.entries(saved).forEach(([key, value]) => {
      const field = $(`#rsvpForm [name="${key}"]`);
      if (field) field.value = value;
    });
    const ticket = renderTicket(saved);
    localStorage.setItem('wedding-rsvp', JSON.stringify(ticket));
    $('#rsvpSuccess').hidden = false;
    $('#viewTicket').hidden = false;
  } catch { /* 忽略无效缓存 */ }
}

$('#openInvitation').addEventListener('click', handleOpen);
$('#closeDialog').addEventListener('click', () => $('#wechatDialog').close());
$('#previewInvitation').addEventListener('click', () => { $('#wechatDialog').close(); openInvitation(); });
$('#copyLink').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(location.origin + location.pathname);
    showToast('请柬链接已复制');
  } catch { showToast('请长按地址栏复制链接'); }
});
$('#copyAddress').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(state.config.wedding.address);
    showToast('宴址已复制');
  } catch { showToast(state.config.wedding.address); }
});
$('#closeTicket').addEventListener('click', () => $('#ticketDialog').close());
$('#viewTicket').addEventListener('click', () => {
  const saved = JSON.parse(localStorage.getItem('wedding-rsvp'));
  if (saved) renderTicket(saved);
  $('#ticketDialog').showModal();
});
$('#printTicket').addEventListener('click', () => window.print());
$('#rsvpForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector('button[type="submit"]');
  button.disabled = true;
  const originalText = button.textContent;
  button.textContent = '正 在 登 记';
  try {
    const data = renderTicket(Object.fromEntries(new FormData(event.currentTarget)));
    const response = await fetch('/api/rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || '登记失败');
    localStorage.setItem('wedding-rsvp', JSON.stringify(data));
    $('#rsvpSuccess').hidden = false;
    $('#viewTicket').hidden = false;
    $('#ticketDialog').showModal();
    showToast('专属电子票已生成');
  } catch (error) {
    showToast(error.message || '登记暂未成功，请稍后再试');
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
});

async function init() {
  await Promise.all([loadConfig(), loadUser()]);
  updateAuthCopy();
  startCountdown();
  initReveal();
  restoreRsvp();
  if (params.get('auth') === 'success') {
    history.replaceState({}, '', location.pathname);
    openInvitation();
  } else if (params.get('auth') === 'failed') {
    history.replaceState({}, '', location.pathname);
    showToast('微信授权未完成，可稍后重试');
  }
}

init();
