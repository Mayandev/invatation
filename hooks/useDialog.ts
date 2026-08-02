'use client';

import { useCallback, useRef } from 'react';

/**
 * 封装 <dialog> 的 showModal/close 调用。
 * 部分微信内置浏览器和旧版 Safari 的 <dialog> 实现不完整，
 * 用 try/catch 降级为普通浮层（.dialog-fallback + body.dialog-open）。
 */
export function useDialog<T extends HTMLDialogElement>() {
  const ref = useRef<T | null>(null);

  const open = useCallback(() => {
    const dialog = ref.current;
    if (!dialog) return;
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
  }, []);

  const close = useCallback(() => {
    const dialog = ref.current;
    if (!dialog) return;
    try {
      if (typeof dialog.close === 'function' && dialog.open) dialog.close();
    } catch {
      dialog.removeAttribute('open');
    }
    dialog.removeAttribute('open');
    dialog.classList.remove('dialog-fallback');
    document.body.classList.remove('dialog-open');
  }, []);

  return { ref, open, close };
}
