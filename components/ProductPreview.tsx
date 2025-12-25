import React, { RefObject, useEffect, useRef, useState } from "react"
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
  productHeight = 600,
  productWidth = 600,
  scaleFactor = 1,
  rotate = 0,
  scroller,
  start = "top top",
  articleTop,
  articleBottom,
  // Adjusted length: 1 viewport height per product for comfortable scrolling
  length = articleTop.length * 100, 
}: ProductPreviewProps) {
  const mainRef = useRef<HTMLElement>(null)
  const dividerTopRef = useRef<HTMLSpanElement>(null)
  const dividerBottomRef = useRef<HTMLSpanElement>(null)
  const articleTopRef = useRef<HTMLElement>(null)
  const articleBottomRef = useRef<HTMLElement>(null)
  
  // Initialize at 0 to prevent black screen on load
  const [currentTopIndex, setCurrentTopIndex] = useState(0)
  const [currentBottomIndex, setCurrentBottomIndex] = useState(0)
  
  const instanceIdRef = useRef<string>(
    `rotating-text-${Math.random().toString(36).substring(2, 11)}`
  )
  const [forceUpdate, setForceUpdate] = useState(false)

  // Active image matches the synchronized indices
  const activeImageIndex = Math.max(0, Math.min(currentTopIndex, productImages.length - 1));

  const handleProgress = (self: ScrollTrigger) => {
    const progress = Math.max(0, Math.min(1, self.progress));
    const total = articleTop.length;
    
    // Calculate synchronous index for all elements (Top, Bottom, Image)
    // This ensures all details change exactly when the product changes
    const index = Math.min(Math.floor(progress * total), total - 1);
    
    // Only update state if index actually changed to minimize re-renders
    if (index !== currentTopIndex) {
        setCurrentTopIndex(index);
        setCurrentBottomIndex(index);
    }
  }

  useEffect(() => {
    if (scroller?.current) {
      setForceUpdate(!forceUpdate)
    }
  }, [])

  useGSAP(() => {
    if (mainRef.current) {
      const existingTrigger = ScrollTrigger.getById(instanceIdRef.current)
      if (existingTrigger) {
        existingTrigger.kill()
      }
      
      // Ensure dividers are visible initially
      gsap.set(dividerTopRef.current, { scaleX: 1, opacity: 1 });
      gsap.set(dividerBottomRef.current, { width: "100%", opacity: 1 });

      gsap.timeline({
        scrollTrigger: {
          trigger: mainRef.current,
          start,
          end: `${length}% top`,
          scrub: 0.5, // Small scrub for smoothing the visual pinning
          scroller: scroller?.current ?? window,
          pin: true,
          onUpdate: handleProgress,
          onLeaveBack: () => {
             // Reset to 0 when scrolling all the way back up
             setCurrentTopIndex(0)
             setCurrentBottomIndex(0)
          },
          id: instanceIdRef.current,
        },
      })
    }
  }, [forceUpdate, length, start])

  return (
    <main
        ref={mainRef}
        className={cn(
          className,
          "w-full h-screen bg-obsidian flex justify-center items-center text-stone-100 px-3 relative overflow-hidden"
        )}
      >
        {/* Global Ambient Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-stone-900/40 rounded-full blur-[120px] pointer-events-none z-0" />

        <div className="relative flex justify-between flex-col w-full max-w-7xl h-[85vh] md:h-[90vh] z-10">
          
          {/* TOP ARTICLE SECTION */}
          <article
            key={1}
            ref={articleTopRef}
            className="mt-4 md:mt-10 w-full md:w-1/2 flex flex-col items-start pl-4 md:pl-12"
          >
            <Translate
                arr={articleTop}
                index={currentTopIndex}
                type={"icon"}
                pos={1}
            />
            <span
              ref={dividerTopRef}
              className="mt-4 md:mt-6 w-full h-[1px] bg-stone-700 relative block origin-right"
            >
              <span className="absolute -right-1 top-0 -translate-y-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-stone-400"></span>
            </span>
            <div className="w-[90%] md:w-[80%] mr-auto mt-4 md:mt-6">
                <Translate
                  arr={articleTop}
                  index={currentTopIndex}
                  type={"title"}
                  pos={1}
                />
                <Translate
                  arr={articleTop}
                  index={currentTopIndex}
                  type={"description"}
                  pos={1}
                />
            </div>
          </article>

          {/* IMAGE CENTER */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] md:w-[600px] aspect-square flex items-center justify-center pointer-events-none">
             {productImages.map((src, i) => (
                 <div 
                    key={i}
                    className={cn(
                        "absolute inset-0 w-full h-full flex items-center justify-center transition-all duration-700 ease-in-out",
                        i === activeImageIndex ? "opacity-100 scale-100 blur-0 z-10" : "opacity-0 scale-95 blur-sm z-0"
                    )}
                 >
                     {/* Glow - Red for first, White for others as requested */}
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
          <article
            key={2}
            ref={articleBottomRef}
            className="ml-auto mb-4 md:mb-10 w-full md:w-1/2 flex flex-col items-end pr-4 md:pr-12 text-right"
          >
              <Translate
                arr={articleBottom}
                index={currentBottomIndex}
                type={"icon"}
                pos={2}
              />
            <span
              ref={dividerBottomRef}
              className="mt-6 md:mt-10 w-full h-[1px] bg-stone-700 relative block origin-left"
            >
              <span className="absolute left-0 top-0 -translate-y-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-stone-400"></span>
            </span>
            <div className="w-[90%] md:w-[80%] ml-auto mt-4 md:mt-6">
                <Translate
                  arr={articleBottom}
                  index={currentBottomIndex}
                  type={"title"}
                  pos={2}
                />
                <Translate
                  arr={articleBottom}
                  index={currentBottomIndex}
                  type={"description"}
                  pos={2}
                />
            </div>
          </article>
        </div>
      </main>
  )
}

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
    const ease = "power2.inOut"
    const duration = 0.5

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
        return cn("font-serif text-3xl md:text-5xl mb-2 leading-none", arr[safeIndex]?.title.className)
      case "description":
        return cn("font-sans text-xs md:text-sm text-stone-400 leading-relaxed font-medium", arr[safeIndex]?.description.className)
      case "icon":
        return cn(
            "text-stone-300 md:scale-125 opacity-80",
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