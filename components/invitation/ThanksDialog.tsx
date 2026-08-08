'use client';

import type { RefObject } from 'react';

interface ThanksDialogProps {
  dialogRef: RefObject<HTMLDialogElement | null>;
  onClose: () => void;
}

export function ThanksDialog({ dialogRef, onClose }: ThanksDialogProps) {
  return (
    <dialog className="thanks-dialog" ref={dialogRef} onClose={onClose}>
      <button className="dialog-close" type="button" aria-label="关闭" onClick={onClose}>
        ×
      </button>
      <div className="thanks-dialog__seal" aria-hidden="true">
        囍
      </div>
      <p className="thanks-dialog__eyebrow">心 意 已 收</p>
      <h2>谢谢您的祝福</h2>
      <p>
        山水有程，心意无距。
        <br />
        我们已收到您的美好祝愿。
      </p>
      <button className="thanks-dialog__button" type="button" onClick={onClose}>
        好的
      </button>
    </dialog>
  );
}
