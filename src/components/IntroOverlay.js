import React, { useCallback, useEffect, useRef, useState } from 'react';

const FADE_MS = 240;

/**
 * Full-screen wrapper for the season intros. Plays for `duration` ms, then fades out over the
 * archive (which is already rendered underneath) and calls `onDone`.
 * A tap, click, Esc, Enter or Space skips straight to the fade.
 */
function IntroOverlay({ className, duration, onDone, style, children }) {
  const [leaving, setLeaving] = useState(false);
  const onDoneRef = useRef(onDone);
  const skipButtonRef = useRef(null);

  useEffect(() => {
    onDoneRef.current = onDone;
  });

  const skip = useCallback(() => setLeaving(true), []);

  useEffect(() => {
    const timer = window.setTimeout(skip, duration);
    return () => window.clearTimeout(timer);
  }, [duration, skip]);

  useEffect(() => {
    if (!leaving) return undefined;
    const timer = window.setTimeout(() => onDoneRef.current?.(), FADE_MS);
    return () => window.clearTimeout(timer);
  }, [leaving]);

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        skip();
      }
    };
    window.addEventListener('keydown', handleKey);

    // Keep the page underneath from scrolling while the intro plays.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    skipButtonRef.current?.focus({ preventScroll: true });

    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [skip]);

  return (
    <div className={`intro ${className}${leaving ? ' intro--leaving' : ''}`} style={style} onClick={skip} role="presentation">
      {children}
      <button
        ref={skipButtonRef}
        type="button"
        className="btn intro__skip"
        onClick={(event) => {
          event.stopPropagation();
          skip();
        }}
      >
        Skip
      </button>
    </div>
  );
}

export default IntroOverlay;
