'use client';

import { useState, useEffect } from 'react';
import styles from './TestimonialCarousel.module.css';
import { cn, getInitials } from '@/lib/utils';

interface Testimonial {
  id: string;
  clientName: string;
  clientRole: string;
  clientCompany: string;
  content: string;
  rating: number;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

export default function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeIndex, isPaused, testimonials.length]);

  const handlePrev = () => {
    setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setActiveIndex((current) => (current + 1) % testimonials.length);
  };

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <div 
      className={styles.carousel}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={styles.quoteMark}>"</div>
      
      <div className={styles.slidesContainer}>
        {testimonials.map((testimonial, idx) => (
          <div 
            key={testimonial.id}
            className={cn(styles.slide, activeIndex === idx && styles.active)}
            style={{ 
              transform: `translateX(${(idx - activeIndex) * 100}%)`,
              opacity: activeIndex === idx ? 1 : 0,
              zIndex: activeIndex === idx ? 10 : 0
            }}
          >
            <div className={styles.rating}>
              {Array.from({ length: 5 }).map((_, i) => (
                <svg 
                  key={i} 
                  className={cn(styles.star, i < testimonial.rating && styles.starFilled)} 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            
            <p className={styles.content}>{testimonial.content}</p>
            
            <div className={styles.author}>
              <div className={styles.avatar}>
                {getInitials(testimonial.clientName)}
              </div>
              <div className={styles.authorInfo}>
                <h4 className={styles.name}>{testimonial.clientName}</h4>
                <p className={styles.role}>
                  {testimonial.clientRole} {testimonial.clientCompany && `at ${testimonial.clientCompany}`}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.controls}>
        <button onClick={handlePrev} className={styles.controlBtn} aria-label="Previous testimonial">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <div className={styles.dots}>
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              className={cn(styles.dot, activeIndex === idx && styles.dotActive)}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
        
        <button onClick={handleNext} className={styles.controlBtn} aria-label="Next testimonial">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
