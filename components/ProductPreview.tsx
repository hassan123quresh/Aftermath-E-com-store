import React, { RefObject, useRef, useState, useEffect } from "react"
import { cn } from "../lib/utils"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export interface ProductPreviewProps {
  className?: string
  productImages: string[]
  glowColors?: string[]
  productHeight?: number
  productWidth?: number
  scaleFactor?: number
  rotate?: number
  length?: number
  scroller?: RefObject<HTMLElement>
  start?: string
  articleTop: {
    title: {
      text: string
      className?: string
    }
    description: {
      text: string
      className?: string
    }
    icon?: React.ReactNode
  }[]
  articleBottom: {
    title: {
      text: string
      className?: string
    }
    description: {
      text: string
      className?: string
    }
    icon?: React.ReactNode
  }[]
}

export function ProductPreview({
  className,
  productImages,
  glowColors = [],
  scaleFactor = 1,
  rotate = 0,
  scroller,
  start = "top top",
  articleTop,
  articleBottom,
  // Default length calculation for Desktop scroll distance
  length = articleTop.length * 60, 
}: ProductPreviewProps) {
  // DESKTOP REFS & STATE
  const desktopContainerRef = useRef<HTMLElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  
  // Active image matches the synchronized indices
  const activeImageIndex = Math.max(0, Math.min(currentIndex, productImages.length - 1));

  // GSAP Logic for Desktop Only
  useGSAP(() => {
    const mm = gsap.matchMedia();
    
    mm.add("(min-width: 768px)", () => {
        if (!desktopContainerRef.current) return;

        const handleProgress = (self: ScrollTrigger) => {
            const progress = Math.max(0, Math.min(1, self.progress));
            const total = articleTop.length;
            const index = Math.min(Math.floor(progress * total), total - 1);
            
            if (index !== currentIndex) {
                setCurrentIndex(index);
            }
        };

        const trigger = ScrollTrigger.create({
            trigger: desktopContainerRef.current,
            start: start,
            end: `${length}% top`,
            scrub: 0.1,
            pin: true,
            scroller: scroller?.current ?? window,
            onUpdate: handleProgress,
            fastScrollEnd: true,
            invalidateOnRefresh: true,
        });

        return () => {
            trigger.kill();
        };
    });
  }, [length, start, articleTop.length]);

  return (
    <div className={cn("relative bg-obsidian w-full", className)}>
        
        {/* =========================================
            DESKTOP VIEW (Restored Vertical Pinning)
            Hidden on Mobile
           ========================================= */}
        <div 
            ref={desktopContainerRef}
            className="hidden md:flex h-screen w-full relative overflow-hidden flex-col justify-between items-center py-10"
        >
             {/* Background Ambient */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-stone-900/40 rounded-full blur-[120px] pointer-events-none z-0" />

            <div className="relative flex justify-between flex-col w-full max-w-7xl h-full z-10">
                {/* TOP ARTICLE SECTION */}
                <article className="mt-10 w-1/2 flex flex-col items-start pl-12">
                    <Translate
                        arr={articleTop}
                        index={currentIndex}
                        type={"icon"}
                        pos={1}
                    />
                    <div className="w-[80%] mr-auto mt-6">
                        <Translate
                            arr={articleTop}
                            index={currentIndex}
                            type={"title"}
                            pos={1}
                        />
                        <Translate
                            arr={articleTop}
                            index={currentIndex}
                            type={"description"}
                            pos={1}
                        />
                    </div>
                </article>

                {/* IMAGE CENTER */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] aspect-square flex items-center justify-center pointer-events-none">
                    {productImages.map((src, i) => (
                        <div 
                            key={i}
                            className={cn(
                                "absolute inset-0 w-full h-full flex items-center justify-center transition-all duration-500 ease-out will-change-transform will-change-opacity",
                                i === activeImageIndex ? "opacity-100 scale-100 blur-0 z-10" : "opacity-0 scale-95 blur-sm z-0"
                            )}
                        >
                            <div 
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full blur-[90px] opacity-60 transition-colors duration-500"
                                style={{ backgroundColor: glowColors[i] || '#292524' }} 
                            />
                            <img
                                src={src}
                                alt="Product"
                                className="relative w-full h-full object-contain drop-shadow-2xl"
                                style={{ 
                                    transform: `rotate(${rotate}deg) scale(${scaleFactor})`, 
                                    transformOrigin: "top" 
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* BOTTOM ARTICLE SECTION */}
                <article className="ml-auto mb-10 w-1/2 flex flex-col items-end pr-12 text-right">
                    <Translate
                        arr={articleBottom}
                        index={currentIndex}
                        type={"icon"}
                        pos={2}
                    />
                    <div className="w-[80%] ml-auto mt-6">
                        <Translate
                            arr={articleBottom}
                            index={currentIndex}
                            type={"title"}
                            pos={2}
                        />
                        <Translate
                            arr={articleBottom}
                            index={currentIndex}
                            type={"description"}
                            pos={2}
                        />
                    </div>
                </article>
            </div>
        </div>


        {/* =========================================
            MOBILE VIEW (Horizontal Swipe Carousel)
            Hidden on Desktop
           ========================================= */}
        <div className="flex md:hidden w-full overflow-x-auto snap-x snap-mandatory no-scrollbar h-[85vh]">
            {productImages.map((src, index) => (
                <div 
                    key={index}
                    className="w-[100vw] h-full flex-shrink-0 snap-center relative flex flex-col justify-between p-6 box-border border-r border-stone-800/30 last:border-r-0"
                >
                    {/* Background Glow */}
                    <div 
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[80px] opacity-40 pointer-events-none z-0"
                        style={{ backgroundColor: glowColors[index] || '#292524' }} 
                    />

                    {/* TOP CONTENT */}
                    <div className="relative z-10 w-full flex flex-col items-start mt-8">
                         {articleTop[index]?.icon && (
                             <div className="mb-4 text-stone-300 opacity-80">
                                 {articleTop[index].icon}
                             </div>
                         )}
                         <h2 className={cn("font-serif text-3xl mb-2 text-stone-100 leading-none", articleTop[index]?.title.className)}>
                             {articleTop[index]?.title.text}
                         </h2>
                         <p className={cn("font-sans text-xs text-stone-400 leading-relaxed font-medium max-w-[80%]", articleTop[index]?.description.className)}>
                             {articleTop[index]?.description.text}
                         </p>
                    </div>

                    {/* IMAGE */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] aspect-square flex items-center justify-center pointer-events-none z-0">
                        <img
                            src={src}
                            alt="Product"
                            className="relative w-full h-full object-contain drop-shadow-2xl"
                            style={{ 
                                transform: `rotate(${rotate}deg) scale(${scaleFactor})`, 
                            }}
                            loading="lazy"
                        />
                    </div>

                    {/* BOTTOM CONTENT */}
                    <div className="relative z-10 w-full flex flex-col items-end text-right mb-12">
                        {articleBottom[index]?.icon && (
                             <div className="mb-4 text-stone-300 opacity-80">
                                 {articleBottom[index].icon}
                             </div>
                         )}
                         <h2 className={cn("font-serif text-3xl mb-2 text-stone-100 leading-none", articleBottom[index]?.title.className)}>
                             {articleBottom[index]?.title.text}
                         </h2>
                         <p className={cn("font-sans text-xs text-stone-400 leading-relaxed font-medium max-w-[80%] ml-auto", articleBottom[index]?.description.className)}>
                             {articleBottom[index]?.description.text}
                         </p>
                    </div>

                     {/* Mobile Swipe Hint */}
                     {index === 0 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/20 text-[10px] uppercase tracking-widest animate-pulse pointer-events-none">
                            Swipe &rarr;
                        </div>
                    )}
                </div>
            ))}
        </div>
    </div>
  )
}

/* 
   Sub-component for Desktop Text Animations
   Used only in the Desktop view to handle the smooth entry/exit of text
*/
interface TranslateProps {
  arr: ProductPreviewProps["articleTop"]
  index: number
  type: "title" | "description" | "icon"
  pos: 1 | 2
}

const Translate: React.FC<TranslateProps> = ({ arr, index, type, pos }) => {
  const previousIndex = useRef<number | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const safeIndex = Math.max(index, 0)

  const direction =
    previousIndex.current !== null && safeIndex < previousIndex.current
      ? "backward"
      : "forward"

  useGSAP(() => {
    if (!contentRef.current) return
    const height = contentRef.current.offsetHeight || 50
    const ease = "power2.out"
    const duration = 0.4

    // Only animate if index changed
    if (previousIndex.current !== safeIndex) {
        if (direction === "forward") {
        gsap.fromTo(
            contentRef.current,
            { y: height, opacity: 0 },
            { y: 0, opacity: 1, duration, ease }
        )
        } else {
        gsap.fromTo(
            contentRef.current,
            { y: -height, opacity: 0 },
            { y: 0, opacity: 1, duration, ease }
        )
        }
    }
  }, [safeIndex])

  useEffect(() => {
    previousIndex.current = safeIndex
  }, [safeIndex])

  if (index < 0) return null

  const renderContent = () => {
    if (safeIndex >= arr.length) return null
    switch (type) {
      case "title":
        return arr[safeIndex].title.text
      case "description":
        return arr[safeIndex].description.text
      case "icon":
        return arr[safeIndex].icon
      default:
        return null
    }
  }

  const getClassName = () => {
    switch (type) {
      case "title":
        return cn("font-serif text-3xl md:text-5xl mb-2 leading-none will-change-transform", arr[safeIndex]?.title.className)
      case "description":
        return cn("font-sans text-xs md:text-sm text-stone-400 leading-relaxed font-medium will-change-transform", arr[safeIndex]?.description.className)
      case "icon":
        return cn(
            "text-stone-300 md:scale-125 opacity-80 will-change-transform",
            pos === 1 ? "py-2 origin-left" : "py-2 origin-right"
        )
      default:
        return ""
    }
  }

  return (
    <div className="overflow-hidden">
      <div ref={contentRef} className={getClassName()}>
        {renderContent()}
      </div>
    </div>
  )
}

export default ProductPreview;