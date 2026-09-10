import { useEffect, useState } from 'react';

const words = ['investment', 'expansion', 'business', 'strategy', 'partnership'];

export default function RotatingDecisionWord() {
  const [text, setText] = useState(words[0]);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer: ReturnType<typeof setTimeout>;

    const start = () => {
      clearTimeout(timer);
      setText(words[0]);
      if (preference.matches) return;

      let index = 0;
      let length = words[0].length;
      let deleting = true;

      const tick = () => {
        length += deleting ? -1 : 1;
        setText(words[index].slice(0, length));
        let delay = deleting ? 65 : 115;
        if (length === 0) {
          index = (index + 1) % words.length;
          deleting = false;
          delay = 300;
        } else if (!deleting && length === words[index].length) {
          deleting = true;
          delay = 1800;
        }
        timer = setTimeout(tick, delay);
      };

      timer = setTimeout(tick, 1800);
    };

    start();
    preference.addEventListener('change', start);
    return () => {
      clearTimeout(timer);
      preference.removeEventListener('change', start);
    };
  }, []);

  return (
    <span className="inline-grid whitespace-nowrap align-bottom text-left">
      <span className="invisible col-start-1 row-start-1" aria-hidden="true">partnership,</span>
      <span className="col-start-1 row-start-1">
        <span className="gradient-text">{text}</span>
        <span className="typing-caret" />
        <span>,</span>
      </span>
    </span>
  );
}
