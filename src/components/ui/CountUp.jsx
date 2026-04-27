import { useEffect, useRef, useState } from 'react';

export default function CountUp({ end, duration = 1200, prefix = '', suffix = '', decimals = 0 }) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const start = 0;
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(start + (end - start) * eased);
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [end, duration]);

  const formatted = decimals > 0
    ? value.toFixed(decimals).replace('.', ',')
    : Math.round(value).toLocaleString('pt-BR');

  return <span>{prefix}{formatted}{suffix}</span>;
}
