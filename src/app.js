// Vite application entry.
const weddingConfig = {
  wedding: {
    groom: '邹明远',
    bride: '孙佳玮',
    date: '2026-10-06T11:58:00+08:00',
    venue: '悦宴楼五楼',
    address: '江西省吉安市悦宴楼五楼',
    city: '吉安'
  }
};

const state = { config: weddingConfig };
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const cover = $('#cover');
const invitation = $('#invitation');
const toast = $('#toast');

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
  return '共赴-1006-0402-1010';
}

function openDialog(dialog) {
  try {
    if (typeof dialog.showModal === 'function') {
      if (!dialog.open) dialog.showModal();
      return;
    }
  } catch {
    // 部分微信和苹果浏览器实现了不完整的对话框接口，改用普通浮层。
  }
  dialog.setAttribute('open', '');
  dialog.classList.add('dialog-fallback');
  document.body.classList.add('dialog-open');
}

function closeDialog(dialog) {
  try {
    if (typeof dialog.close === 'function' && dialog.open) dialog.close();
  } catch {
    dialog.removeAttribute('open');
  }
  dialog.removeAttribute('open');
  dialog.classList.remove('dialog-fallback');
  document.body.classList.remove('dialog-open');
}

function renderTicket(data) {
  const attending = data.attendance !== 'no';
  const ticketNumber = createTicketNumber();
  const query = new URLSearchParams({
    ticket: ticketNumber,
    guest: data.name || '亲爱的宾客'
  });
  const guideUrl = `${location.protocol}//${location.host}/guide.html?${query.toString()}`;

  $('#ticketGuest').textContent = data.name || '亲爱的宾客';
  $('#ticketSeat').textContent = attending ? '待引座官确认' : '云端特别席';
  $('#ticketDate').textContent = formatNumericDate(state.config.wedding.date);
  $('#ticketNumber').textContent = ticketNumber;
  $('#guideLink').href = guideUrl;
  $('#ticketQr').src = `/api/ticket-qr?text=${encodeURIComponent(guideUrl)}`;
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
  document.title = `${data.groom}与${data.bride} · 婚礼请柬`;
}

function loadConfig() {
  bindWeddingData();
}

function openInvitation() {
  cover.classList.add('is-opening');
  invitation.setAttribute('aria-hidden', 'false');
  document.body.classList.remove('cover-active');
  requestAnimationFrame(() => $('.hero').classList.add('is-visible'));
  setTimeout(() => { cover.hidden = true; }, 1100);
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

$('#openInvitation').addEventListener('click', openInvitation);
$('#copyAddress').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(state.config.wedding.address);
    showToast('宴址已复制');
  } catch { showToast(state.config.wedding.address); }
});
$('#closeTicket').addEventListener('click', () => closeDialog($('#ticketDialog')));
$('#viewTicket').addEventListener('click', () => {
  const saved = JSON.parse(localStorage.getItem('wedding-rsvp'));
  if (saved) renderTicket(saved);
  openDialog($('#ticketDialog'));
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
    const raw = await response.text();
    let result = {};
    try {
      result = raw ? JSON.parse(raw) : {};
    } catch {
      throw new Error('服务器响应异常，请稍后再试');
    }
    if (!response.ok) throw new Error(result.error || '登记失败');
    localStorage.setItem('wedding-rsvp', JSON.stringify(data));
    $('#rsvpSuccess').hidden = false;
    $('#viewTicket').hidden = false;
    openDialog($('#ticketDialog'));
    showToast('专属电子票已生成');
  } catch (error) {
    showToast(error.message || '登记暂未成功，请稍后再试');
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
});

function init() {
  loadConfig();
  startCountdown();
  initReveal();
  restoreRsvp();
}

init();
