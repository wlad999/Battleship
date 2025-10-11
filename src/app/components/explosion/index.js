import { useEffect, useRef, useState } from 'react';
import cls from 'classnames';
import styles from './styles.module.scss';

export default function Explosion() {
  const ref = useRef(null);

  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const frameCount = 8;
    const interval = 1000 / frameCount;
    let frame = 0;

    const timer = setInterval(() => {
      const percent = (frame / (frameCount - 1)) * 100;
      if (ref.current) {
        ref.current.style.backgroundPosition = `${percent}% 0`;
      }
      frame++;
      if (frame >= frameCount) {
        clearInterval(timer);
        setDone(true);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [ref]);

  return (
    <div
      ref={ref}
      className={cls({ [styles.explosion]: !done, [styles.fire]: done })}
    />
  );
}
