import React, { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// Helper hook for mobile detection
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  return isMobile;
};

export interface ThreeDCarouselItem {
  id: number;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  link: string;
}

interface ThreeDCarouselProps {
  items: ThreeDCarouselItem[];
  autoRotate?: boolean;
  rotateInterval?: number;
}

const ThreeDCarousel: React.FC<ThreeDCarouselProps> = ({
  items,
  autoRotate = true,
  rotateInterval = 4000,
}) => {
  const [active, setActive] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Touch state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  useEffect(() => {
    if (autoRotate && isInView && !isHovering) {
      const interval = setInterval(() => {
        setActive((prev) => (prev + 1) % items.length);
      }, rotateInterval);
      return () => clearInterval(interval);
    }
  }, [isInView, isHovering, autoRotate, rotateInterval, items.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (carouselRef.current) observer.observe(carouselRef.current);
    return () => observer.disconnect();
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      setActive((prev) => (prev + 1) % items.length);
    } else if (distance < -minSwipeDistance) {
      setActive((prev) => (prev - 1 + items.length) % items.length);
    }
  };

  const getCardStyle = (index: number) => {
    const total = items.length;
    const nextIndex = (active + 1) % total;
    const prevIndex = (active - 1 + total) % total;

    if (index === active) {
        return {
            zIndex: 20,
            opacity: 1,
            transform: 'translateX(0) scale(1)',
            filter: 'blur(0px)'
        };
    } else if (index === nextIndex) {
        return {
            zIndex: 10,
            opacity: 0.6,
            transform: 'translateX(40%) scale(0.85)',
            filter: 'blur(2px)'
        };
    } else if (index === prevIndex) {
        return {
            zIndex: 10,
            opacity: 0.6,
            transform: 'translateX(-40%) scale(0.85)',
            filter: 'blur(2px)'
        };
    } else {
        return {
            zIndex: 0,
            opacity: 0,
            transform: 'scale(0.8)',
            pointerEvents: 'none'
        };
    }
  };

  return (
    <div 
        ref={carouselRef}
        className="relative w-full h-[500px] flex items-center justify-center perspective-1000"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
    >
        {/* Cards */}
        <div className="relative w-full max-w-md h-[450px] flex justify-center items-center">
            {items.map((item, index) => {
                const style = getCardStyle(index);
                return (
                    <div
                        key={item.id}
                        className="absolute top-0 w-full h-full transition-all duration-500 ease-out p-4"
                        style={style as React.CSSProperties}
                    >
                        <div className="w-full h-full bg-stone-50 border border-stone-200 shadow-2xl rounded-xl overflow-hidden flex flex-col">
                            {/* Image Area */}
                            <div className="h-56 overflow-hidden relative bg-stone-200 flex-shrink-0">
                                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/10"></div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <span className="text-[10px] bg-white/90 backdrop-blur px-2 py-1 rounded text-obsidian uppercase tracking-widest font-bold border border-stone-200">
                                        {item.category}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Content Area */}
                            <div className="p-6 flex-1 flex flex-col bg-white">
                                <h3 className="font-serif text-xl md:text-2xl text-obsidian mb-3 leading-none">{item.title}</h3>
                                <p className="text-sm text-stone-500 mb-6 flex-1 line-clamp-3 leading-relaxed font-sans">{item.description}</p>
                                
                                <Link to={item.link} className="mt-auto flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-obsidian hover:gap-4 transition-all group pb-1 border-b border-transparent hover:border-obsidian w-fit">
                                    Read Article <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>

        {/* Controls (Desktop) */}
        {!isMobile && items.length > 1 && (
            <>
                <button 
                    onClick={() => setActive((prev) => (prev - 1 + items.length) % items.length)}
                    className="absolute left-4 z-30 p-3 bg-white/80 backdrop-blur rounded-full shadow-md text-stone-600 hover:text-obsidian hover:scale-110 transition-all border border-stone-200"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                    onClick={() => setActive((prev) => (prev + 1) % items.length)}
                    className="absolute right-4 z-30 p-3 bg-white/80 backdrop-blur rounded-full shadow-md text-stone-600 hover:text-obsidian hover:scale-110 transition-all border border-stone-200"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </>
        )}

        {/* Indicators */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 z-30">
            {items.map((_, idx) => (
                <button
                    key={idx}
                    onClick={() => setActive(idx)}
                    className={`h-1 rounded-full transition-all duration-300 ${active === idx ? 'bg-obsidian w-8' : 'bg-stone-300 w-2 hover:bg-stone-400'}`}
                />
            ))}
        </div>
    </div>
  );
};

export default ThreeDCarousel;