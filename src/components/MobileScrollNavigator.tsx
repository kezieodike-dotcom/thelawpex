import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GripVertical } from 'lucide-react';

type ScrollTarget = HTMLElement | null;

const currentTarget = (): ScrollTarget => {
  let element = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
  while (element instanceof HTMLElement && element !== document.body) {
    if (/(auto|scroll)/.test(getComputedStyle(element).overflowY) && element.scrollHeight > element.clientHeight + 24) return element;
    element = element.parentElement;
  }
  return null;
};

const scrollBounds = (target: ScrollTarget) => {
  const root = target ?? document.scrollingElement ?? document.documentElement;
  const top = target ? target.scrollTop : window.scrollY;
  const height = target ? target.clientHeight : window.innerHeight;
  const maximum = Math.max(0, root.scrollHeight - height);
  return { top, height, maximum, available: maximum > 24, progress: maximum > 0 ? Math.max(0, Math.min(1, top / maximum)) : 0 };
};

const moveTo = (target: ScrollTarget, top: number) => {
  (target ?? window).scrollTo({ top, behavior: 'instant' as ScrollBehavior });
};

const positionLabel = (target: ScrollTarget, progress: number) => {
  const pages = (target ?? document).querySelectorAll<HTMLElement>('[data-report-page-number], [data-page-number]');
  if (!pages.length) return Math.round(progress * 100) + '%';
  const tracker = document.querySelector('[data-report-page-tracker]')?.getBoundingClientRect();
  const readingLine = target ? target.getBoundingClientRect().top + 24 : Math.max(96, tracker?.bottom ?? 0) + 16;
  // Pages are ordered in the DOM; binary search avoids measuring every page while dragging.
  let low = 0;
  let high = pages.length - 1;
  while (low < high) {
    const middle = Math.ceil((low + high) / 2);
    if (pages[middle].getBoundingClientRect().top <= readingLine) low = middle;
    else high = middle - 1;
  }
  const page = pages[low].dataset.reportPageNumber ?? pages[low].dataset.pageNumber;
  const last = pages[pages.length - 1];
  return 'Page ' + page + ' of ' + (last.dataset.reportPageNumber ?? last.dataset.pageNumber);
};

export const MobileScrollNavigator: React.FC<{ inCaseRail?: boolean }> = ({ inCaseRail = false }) => {
  const [position, setPosition] = useState({ available: false, progress: 0, label: '0%' });
  const [dragging, setDragging] = useState(false);
  const [focused, setFocused] = useState(false);
  const rail = useRef<HTMLDivElement>(null);
  const gesture = useRef<{ pointerId: number; offset: number; fraction: number; target: ScrollTarget } | null>(null);
  const refresh = useRef<() => void>(() => {});

  const stop = useCallback(() => {
    const held = gesture.current;
    gesture.current = null;
    if (held && rail.current?.hasPointerCapture(held.pointerId)) rail.current.releasePointerCapture(held.pointerId);
    setDragging(false);
    refresh.current();
  }, []);

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 1023px)');
    let queued: number | null = null;
    const update = () => {
      queued = null;
      const target = gesture.current ? gesture.current.target : currentTarget();
      let bounds = scrollBounds(target);
      // Virtualized law pages can change height as they load beneath a held handle.
      if (gesture.current && Math.abs(bounds.top - gesture.current.fraction * bounds.maximum) > 1) {
        moveTo(target, gesture.current.fraction * bounds.maximum);
        bounds = scrollBounds(target);
      }
      const available = mobile.matches && bounds.available;
      if (!available && gesture.current) stop();
      const next = { available, progress: bounds.progress, label: available ? positionLabel(target, bounds.progress) : '' };
      setPosition(previous => previous.available === next.available && previous.progress === next.progress && previous.label === next.label ? previous : next);
    };
    const schedule = () => {
      if (queued === null) queued = requestAnimationFrame(update);
    };
    const visibility = () => { if (document.hidden) stop(); schedule(); };
    refresh.current = schedule;
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    const main = document.querySelector('main');
    if (main) observer.observe(main);
    window.addEventListener('resize', schedule);
    window.addEventListener('blur', stop);
    window.addEventListener('pointerup', stop);
    window.addEventListener('pointercancel', stop);
    document.addEventListener('scroll', schedule, true);
    document.addEventListener('focusin', schedule);
    document.addEventListener('focusout', schedule);
    document.addEventListener('visibilitychange', visibility);
    mobile.addEventListener('change', schedule);
    schedule();
    return () => {
      refresh.current = () => {};
      stop();
      if (queued !== null) cancelAnimationFrame(queued);
      observer.disconnect();
      window.removeEventListener('resize', schedule);
      window.removeEventListener('blur', stop);
      window.removeEventListener('pointerup', stop);
      window.removeEventListener('pointercancel', stop);
      document.removeEventListener('scroll', schedule, true);
      document.removeEventListener('focusin', schedule);
      document.removeEventListener('focusout', schedule);
      document.removeEventListener('visibilitychange', visibility);
      mobile.removeEventListener('change', schedule);
    };
  }, [stop]);

  const scrub = (clientY: number) => {
    const held = gesture.current;
    const box = rail.current?.getBoundingClientRect();
    if (!held || !box) return;
    const fraction = Math.max(0, Math.min(1, (clientY - box.top - 22 - held.offset) / Math.max(1, box.height - 44)));
    held.fraction = fraction;
    moveTo(held.target, fraction * scrollBounds(held.target).maximum);
    refresh.current();
  };

  if (!position.available) return null;

  return (
    <div
      ref={rail}
      role="slider"
      tabIndex={0}
      aria-label="Document position"
      aria-orientation="vertical"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(position.progress * 100)}
      aria-valuetext={position.label}
      title="Drag to move through the document"
      className={'lawpex-focus-ring fixed z-30 touch-none select-none rounded-full [-webkit-touch-callout:none] lg:hidden print:hidden ' + (inCaseRail ? 'bottom-[calc(1.25rem+env(safe-area-inset-bottom))] left-6 h-[clamp(5.5rem,calc(100dvh-34rem),17.5rem)] w-11' : 'bottom-[calc(6rem+env(safe-area-inset-bottom))] right-0 h-52 max-h-[calc(100dvh-14rem)] w-7')}
      onContextMenu={event => event.preventDefault()}
      onPointerDown={event => {
        if (event.button !== 0) return;
        event.preventDefault();
        const box = event.currentTarget.getBoundingClientRect();
        const thumbCenter = box.top + 22 + position.progress * (box.height - 44);
        const onThumb = (event.target as HTMLElement).closest('[data-scroll-thumb]');
        gesture.current = { pointerId: event.pointerId, offset: onThumb ? event.clientY - thumbCenter : 0, fraction: position.progress, target: currentTarget() };
        event.currentTarget.setPointerCapture(event.pointerId);
        setDragging(true);
        scrub(event.clientY);
      }}
      onPointerMove={event => { if (gesture.current?.pointerId === event.pointerId) scrub(event.clientY); }}
      onPointerUp={stop}
      onPointerCancel={stop}
      onLostPointerCapture={stop}
      onFocus={() => setFocused(true)}
      onBlur={() => { setFocused(false); stop(); }}
      onKeyDown={event => {
        const target = currentTarget();
        const bounds = scrollBounds(target);
        const steps: Record<string, number> = {
          ArrowUp: bounds.top - bounds.height * 0.15,
          ArrowDown: bounds.top + bounds.height * 0.15,
          PageUp: bounds.top - bounds.height * 0.85,
          PageDown: bounds.top + bounds.height * 0.85,
          Home: 0,
          End: bounds.maximum,
        };
        if (!(event.key in steps)) return;
        event.preventDefault();
        moveTo(target, Math.max(0, Math.min(bounds.maximum, steps[event.key])));
        refresh.current();
      }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-[22px] left-1/2 w-1 -translate-x-1/2 overflow-hidden rounded-full bg-amber-200/80">
        <div className="w-full bg-amber-500" style={{ height: position.progress * 100 + '%' }} />
      </div>
      <div className="pointer-events-none absolute inset-y-[22px] inset-x-0">
        <div
          data-scroll-thumb
          className={'pointer-events-auto absolute left-0 flex h-11 w-full -translate-y-1/2 items-center justify-center rounded-lg border border-amber-400 text-neutral-900 shadow-md ' + (dragging ? 'cursor-grabbing bg-yellow-400' : 'cursor-grab bg-yellow-300')}
          style={{ top: position.progress * 100 + '%' }}
        >
          <GripVertical className="h-5 w-5" aria-hidden="true" />
          {(dragging || focused) && (
            <span role="status" className={'pointer-events-none absolute whitespace-nowrap rounded-md border border-amber-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-neutral-900 shadow-md ' + (inCaseRail ? 'left-full ml-2' : 'right-full mr-2')}>
              {position.label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
