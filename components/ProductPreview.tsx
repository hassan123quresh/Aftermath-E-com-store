import React, { useState } from "react"
import { cn } from "../lib/utils"
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface ProductPreviewProps {
  className?: string
  productImages: string[]
  glowColors?: string[]
  productHeight?: number
  productWidth?: number
  scaleFactor?: number
  rotate?: number
  length?: number
  scroller?: any
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
  articleTop,
  articleBottom,
}: ProductPreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % productImages.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + productImages.length) % productImages.length)
  }

  return (
    <div className={cn("relative bg-obsidian w-full", className)}>
        
        {/* =========================================
            DESKTOP VIEW (Interactive Carousel)
           ========================================= */}
        <div className="hidden md:flex h-[800px] w-full relative items-center justify-center overflow-hidden">
             {/* Background Ambient - Dynamic based on active index */}
            <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] pointer-events-none transition-colors duration-700 ease-in-out z-0"
                style={{ backgroundColor: (glowColors[currentIndex] || '#292524') + '40' }} // 25% opacity
            />

            {/* Content Grid */}
            <div className="relative w-full max-w-7xl px-12 grid grid-cols-12 items-center z-10 h-full">
                
                {/* LEFT CONTENT (Article Top) */}
                <div className="col-span-3 flex flex-col items-start space-y-8">
                    {/* Wrapper with key to trigger animation on change */}
                    <div key={`top-${currentIndex}`} className="animate-fade-in-up flex flex-col items-start duration-500">
                         <div className="text-stone-300 opacity-80 mb-4 scale-110 origin-left">
                             {articleTop[currentIndex]?.icon}
                         </div>
                         <h2 className={cn("font-serif text-5xl mb-4 text-stone-100 leading-tight", articleTop[currentIndex]?.title.className)}>
                             {articleTop[currentIndex]?.title.text}
                         </h2>
                         <p className={cn("font-sans text-sm text-stone-400 leading-relaxed font-medium", articleTop[currentIndex]?.description.className)}>
                             {articleTop[currentIndex]?.description.text}
                         </p>
                    </div>
                </div>

                {/* CENTER IMAGE */}
                <div className="col-span-6 relative h-full flex items-center justify-center">
                    {productImages.map((src, i) => (
                        <div 
                            key={i}
                            className={cn(
                                "absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out",
                                i === currentIndex ? "opacity-100 scale-100 blur-0 z-10" : "opacity-0 scale-90 blur-sm z-0"
                            )}
                        >
                            <img
                                src={src}
                                alt=""
                                className="max-h-[80%] w-auto object-contain drop-shadow-2xl"
                                style={{ 
                                    transform: `rotate(${rotate}deg) scale(${scaleFactor})`, 
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* RIGHT CONTENT (Article Bottom) */}
                <div className="col-span-3 flex flex-col items-end text-right space-y-8">
                    <div key={`btm-${currentIndex}`} className="animate-fade-in-up flex flex-col items-end duration-500" style={{ animationDelay: '100ms' }}>
                         <div className="text-stone-300 opacity-80 mb-4 scale-110 origin-right">
                             {articleBottom[currentIndex]?.icon}
                         </div>
                         <h2 className={cn("font-serif text-5xl mb-4 text-stone-100 leading-tight", articleBottom[currentIndex]?.title.className)}>
                             {articleBottom[currentIndex]?.title.text}
                         </h2>
                         <p className={cn("font-sans text-sm text-stone-400 leading-relaxed font-medium", articleBottom[currentIndex]?.description.className)}>
                             {articleBottom[currentIndex]?.description.text}
                         </p>
                    </div>
                </div>
            </div>

            {/* NAVIGATION BUTTONS */}
            <button 
                onClick={handlePrev}
                className="absolute left-8 z-30 p-4 rounded-full border border-stone-800 bg-obsidian/50 hover:bg-stone-800 text-stone-400 hover:text-white transition-all backdrop-blur-sm group"
            >
                <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            </button>
            <button 
                onClick={handleNext}
                className="absolute right-8 z-30 p-4 rounded-full border border-stone-800 bg-obsidian/50 hover:bg-stone-800 text-stone-400 hover:text-white transition-all backdrop-blur-sm group"
            >
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* INDICATORS */}
            <div className="absolute bottom-10 flex gap-3 z-30">
                {productImages.map((_, i) => (
                    <button 
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={cn(
                            "h-1 rounded-full transition-all duration-300",
                            i === currentIndex ? "w-8 bg-white" : "w-2 bg-stone-700 hover:bg-stone-500"
                        )}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
        </div>


        {/* =========================================
            MOBILE VIEW (Horizontal Swipe Carousel)
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

export default ProductPreview;