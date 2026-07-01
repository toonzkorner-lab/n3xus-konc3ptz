'use client';

import { useEffect, useState, useRef } from 'react';
import styles from './StatsCounter.module.css';

interface StatItem {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
}

interface StatsCounterProps {
  stats: StatItem[];
}

export default function StatsCounter({ stats }: StatsCounterProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.container} ref={containerRef}>
      {stats.map((stat, idx) => (
        <div key={idx} className={styles.statItem} style={{ animationDelay: `${idx * 200}ms` }}>
          <div className={styles.valueWrapper}>
            {stat.prefix && <span className={styles.prefix}>{stat.prefix}</span>}
            <Counter value={isVisible ? stat.value : 0} duration={2000} />
            {stat.suffix && <span className={styles.suffix}>{stat.suffix}</span>}
          </div>
          <p className={styles.label}>{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

// Counter component using requestAnimationFrame
function Counter({ value, duration }: { value: number, duration: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (value === 0) {
      setCount(0);
      return;
    }

    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function for smoother animation (easeOutQuart)
      const easeOut = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOut * value));
      
      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  return <span className={styles.value}>{count.toLocaleString()}</span>;
}
