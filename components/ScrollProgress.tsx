import React, { useEffect, useState } from 'react';
import { cn } from '../lib/utils';

interface ScrollProgressProps {
  className?: string;
  barColor?: string;
  trackColor?: string;
}

export const ScrollProgress: React.FC<ScrollProgressProps> = ({ 
  className,
  barColor = "bg-obsidian",
  trackColor = "bg-transparent"
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      
      if (scrollHeight > 0) {
        const scrolled = scrollTop / scrollHeight;
        setProgress(Math.min(Math.max(scrolled, 0), 1));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initialize on mount

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={cn("fixed left-0 right-0 z-40 h-1", trackColor, className)}>
      <div 
        className={cn("h-full transition-all duration-150 ease-out", barColor)}
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
};