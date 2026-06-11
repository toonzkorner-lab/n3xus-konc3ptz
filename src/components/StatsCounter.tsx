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

// Simple counter component
function Counter({ value, duration }: { value: number, duration: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    let totalMilSecDur = duration;
    let incrementTime = (totalMilSecDur / end) * 2;

    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span className={styles.value}>{count.toLocaleString()}</span>;
}
