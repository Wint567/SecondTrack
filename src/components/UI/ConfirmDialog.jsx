import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Подтвердить',
  cancelLabel = 'Отмена',
  isPending = false,
  error = '',
  onConfirm,
  onCancel,
}) {
  const dialogRef = useRef(null);
  const cancelButtonRef = useRef(null);
  const onCancelRef = useRef(onCancel);
  const isPendingRef = useRef(isPending);
  const titleId = useId();
  const descriptionId = useId();

  onCancelRef.current = onCancel;
  isPendingRef.current = isPending;

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previouslyFocusedElement = document.activeElement;
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusFrame = window.requestAnimationFrame(() => cancelButtonRef.current?.focus());

    function handleKeyDown(event) {
      if (event.key === 'Escape' && !isPendingRef.current) {
        event.preventDefault();
        onCancelRef.current?.();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const focusableElements = dialogRef.current?.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );

      if (!focusableElements?.length) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;

      if (previouslyFocusedElement?.isConnected) {
        previouslyFocusedElement.focus?.();
      }
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isPending) {
          onCancel?.();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        aria-busy={isPending}
        className="w-full max-w-md rounded-2xl border border-slate-800/90 bg-slate-900 p-5 shadow-panel"
      >
        <div className="space-y-2">
          <h2 id={titleId} className="text-lg font-semibold text-white">{title}</h2>
          {description ? <p id={descriptionId} className="text-sm text-slate-400">{description}</p> : null}
          {error ? (
            <p role="alert" className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
              {error}
            </p>
          ) : null}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button ref={cancelButtonRef} type="button" className="button-secondary" onClick={onCancel} disabled={isPending}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-100 transition hover:border-rose-400/50 hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? 'Удаление...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
