import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../StoreContext';
import { Truck, Package, ArrowRight, ChevronLeft, ChevronRight, X, ZoomIn, HelpCircle, PlayCircle, Star, MessageSquare } from 'lucide-react';
import { marked } from 'marked';
import katex from 'katex';
import createDOMPurify from 'dompurify';
import LiquidButton from '../components/LiquidButton';
import { PriceBadge } from '../components/PriceBadge';
import StarRating from '../components/StarRating';

// Initialize DOMPurify Factory
const DOMPurify = typeof window !== 'undefined' ? createDOMPurify(window) : null;

// Configure marked with a custom tokenizer for math ($...$ and $$...$$)
const mathExtension = {
    name: 'math',
    level: 'inline',
    start(src: string) { 
        const match = src.match(/\$/);
        return match ? match.index : -1;
    },
    tokenizer(src: string, tokens: any) {
        const blockRule = /^\$\$([\s\S]+?)\$\$/;
        const inlineRule = /^\$([^$\n]+?)\$/;
        
        let match = blockRule.exec(src);
        if (match) {
            return {
                type: 'math',
                raw: match[0],
                text: match[1].trim(),
                display: true
            };
        }
        
        match = inlineRule.exec(src);
        if (match) {
             return {
                type: 'math',
                raw: match[0],
                text: match[1].trim(),
                display: false
            };
        }
    },
    renderer(token: any) {
        if (!katex) return token.text;
        try {
            return katex.renderToString(token.text, {
                displayMode: token.display,
                throwOnError: false,
                output: 'html'
            });
        } catch (e) {
            return token.text;
        }
    }
};

// Initialize marked with extensions
try {
    marked.use({ 
        extensions: [mathExtension as any], 
        gfm: true, 
        breaks: true 
    });
} catch (e) {
    console.warn("Marked configuration warning:", e);
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, toggleCart, showToast, reviews, addReview } = useStore();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [showSizeError, setShowSizeError] = useState(false);
  
  // Review Form State
  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  
  // Ref for main image to perform animation
  const mainImageRef = useRef<HTMLImageElement>(null);
  
  // State for button feedback
  const [activeButton, setActiveButton] = useState<'none' | 'cart' | 'buy'>('none');

  // Zoom and Swipe State
  const [isZoomed, setIsZoomed] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Fix: Scroll to top when product page is opened or changed
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Lock body scroll when zoomed
  useEffect(() => {
    if (isZoomed) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [isZoomed]);

  const product = products.find(p => p.id === id);

  if (!product || !product.isVisible) return <div className="h-screen flex items-center justify-center font-serif text-lg">Product not found.</div>;

  // Global Stock Check
  const totalStock = product.inventory.reduce((acc, v) => acc + v.stock, 0);
  const isCompletelySoldOut = totalStock <= 0;

  // Calculate Ratings
  const productReviews = reviews.filter(r => r.productId === product.id);
  const avgRating = productReviews.length > 0 
      ? productReviews.reduce((acc, r) => acc + r.rating, 0) / productReviews.length 
      : 0;

  // Construct mixed media array
  const mediaItems = [
      ...product.images.map(src => ({ type: 'image' as const, src })),
      ...(product.galleryVideo ? [{ type: 'video' as const, src: product.galleryVideo }] : [])
  ];

  const activeMedia = mediaItems[activeMediaIndex];

  // Only show related items that are visible
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id && p.isVisible)
    .slice(0, 3);

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setShowSizeError(false);
  };

  const handleAddToCart = () => {
    if (isCompletelySoldOut) return;

    if (!selectedSize) {
      setShowSizeError(true);
      return;
    }
    
    // Animation Logic - Only if current media is an image
    if (activeMedia.type === 'image') {
        const imgElement = mainImageRef.current;
        const cartIcon = document.getElementById('cart-icon-btn');

        if (imgElement && cartIcon) {
            const imgRect = imgElement.getBoundingClientRect();
            const cartRect = cartIcon.getBoundingClientRect();

            const flyingImg = imgElement.cloneNode() as HTMLImageElement;
            
            // Initial Styles
            flyingImg.style.position = 'fixed';
            flyingImg.style.left = `${imgRect.left}px`;
            flyingImg.style.top = `${imgRect.top}px`;
            flyingImg.style.width = `${imgRect.width}px`;
            flyingImg.style.height = `${imgRect.height}px`;
            flyingImg.style.zIndex = '1000';
            flyingImg.style.pointerEvents = 'none';
            flyingImg.style.transition = 'all 0.8s cubic-bezier(0.19, 1, 0.22, 1)';
            flyingImg.style.opacity = '1';
            flyingImg.style.borderRadius = '0';
            flyingImg.style.objectFit = 'cover';

            document.body.appendChild(flyingImg);

            // Force Reflow
            void flyingImg.offsetHeight;

            // Target Styles (Center of the cart button)
            const targetX = cartRect.left + cartRect.width / 2 - 10;
            const targetY = cartRect.top + cartRect.height / 2 - 10;

            flyingImg.style.left = `${targetX}px`;
            flyingImg.style.top = `${targetY}px`;
            flyingImg.style.width = '20px';
            flyingImg.style.height = '20px';
            flyingImg.style.opacity = '0';
            flyingImg.style.borderRadius = '50%';

            setTimeout(() => {
                flyingImg.remove();
            }, 800);
        }
    }
    
    // Provide visual feedback
    setActiveButton('cart');
    addToCart(product, selectedSize);
    
    // Show toast with two actions
    showToast("Added to Cart", [
        { label: "View Cart", onClick: toggleCart },
        { label: "Checkout", onClick: () => navigate('/checkout'), primary: true }
    ]);

    // Reset button state after delay
    setTimeout(() => {
      setActiveButton('none');
    }, 2000);
  };

  const handleBuyNow = () => {
      if (isCompletelySoldOut) return;
      if (!selectedSize) {
        setShowSizeError(true);
        return;
      }
      
      // Visual feedback
      setActiveButton('buy');
      addToCart(product, selectedSize);
      
      // Navigate after a brief delay to show the feedback
      setTimeout(() => {
        setActiveButton('none');
        // If drawer is open, close it (though navigate usually handles this via layout logic)
        navigate('/checkout');
      }, 500);
  };

  const handleNextMedia = () => {
      setActiveMediaIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const handlePrevMedia = () => {
      setActiveMediaIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
      e.preventDefault();
      if (newReview.name && newReview.comment) {
          setIsSubmittingReview(true);
          // Simulate network delay
          setTimeout(() => {
              addReview({
                  id: `REV-${Date.now()}`,
                  productId: product.id,
                  userName: newReview.name,
                  rating: newReview.rating,
                  comment: newReview.comment,
                  date: new Date().toISOString().split('T')[0]
              });
              setNewReview({ name: '', rating: 5, comment: '' });
              setIsSubmittingReview(false);
              showToast("Review submitted successfully");
          }, 800);
      }
  };

  // Swipe Handlers
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
      setTouchEnd(null);
      setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
      setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
      if (!touchStart || !touchEnd) return;
      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;
      
      if (isLeftSwipe) {
          handleNextMedia();
      }
      if (isRightSwipe) {
          handlePrevMedia();
      }
  };

  const toggleZoom = () => {
      // Only allow zoom on desktop view (md and up) and if it's an image
      if (window.innerWidth >= 768 && activeMedia.type === 'image') {
          setIsZoomed(!isZoomed);
      }
  };

  // Advanced Markdown Renderer
  const renderDescription = (text: string) => {
    if (!text) return null;
    try {
        const rawHtml = marked.parse(text) as string;
        // Use sanitizer if available, otherwise raw HTML (fallback)
        const cleanHtml = DOMPurify ? DOMPurify.sanitize(rawHtml, {
             ADD_TAGS: ['iframe', 'u', 'img'], // Allow iframes and underline
             ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling']
        }) : rawHtml;
        
        // CSS classes for styling - Updated to match the requested image style
        const proseClasses = `
            prose prose-stone prose-sm md:prose-base max-w-none 
            prose-headings:font-serif prose-headings:font-normal prose-headings:text-obsidian
            prose-p:text-obsidian prose-p:opacity-80 prose-p:leading-relaxed
            prose-a:text-obsidian prose-a:underline prose-a:underline-offset-2
            prose-strong:text-obsidian prose-strong:font-bold
            prose-em:font-serif prose-em:not-italic
            prose-ul:list-disc prose-ol:list-decimal
            prose-li:marker:text-stone-400
            
            /* Table Styling: Custom Background #EDECE7, Thick Dark Borders, Rounded Corners */
            [&_table]:w-full 
            [&_table]:border-separate [&_table]:border-spacing-0 
            [&_table]:rounded-xl [&_table]:overflow-hidden 
            [&_table]:my-8 
            [&_table]:border-[2px] [&_table]:border-stone-600
            [&_table]:bg-[#EDECE7]
            [&_table]:shadow-sm
            
            /* Header Row */
            [&_thead]:bg-[#EDECE7]
            [&_th]:p-3 md:p-4 
            [&_th]:text-center 
            [&_th]:font-sans [&_th]:font-bold 
            [&_th]:text-xs md:text-sm 
            [&_th]:uppercase [&_th]:tracking-wider 
            [&_th]:text-stone-700
            [&_th]:border-b-[2px] [&_th]:border-r-[2px] [&_th]:border-stone-600
            [&_th:last-child]:border-r-0

            /* Body Rows */
            [&_td]:p-3 md:p-4 
            [&_td]:text-center 
            [&_td]:text-xs md:text-sm 
            [&_td]:font-semibold
            [&_td]:text-stone-700 
            [&_td]:bg-[#EDECE7]
            [&_td]:border-b-[2px] [&_td]:border-r-[2px] [&_td]:border-stone-600
            [&_td:last-child]:border-r-0
            [&_tr:last-child_td]:border-b-0

            /* First Column Specifics (Left aligned headers and data) */
            [&_th:first-child]:text-left
            [&_td:first-child]:text-left [&_td:first-child]:font-bold [&_td:first-child]:uppercase [&_td:first-child]:tracking-wider [&_td:first-child]:text-stone-600

            [&_blockquote]:border-l-2 [&_blockquote]:border-obsidian [&_blockquote]:pl-4 [&_blockquote]:not-italic [&_blockquote]:opacity-70
        `;

        return (
            <div 
                className={proseClasses}
                dangerouslySetInnerHTML={{ __html: cleanHtml }} 
            />
        );
    } catch (e) {
        // Fallback
        return <p className="whitespace-pre-line">{text}</p>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-4 md:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
        
        {/* LEFT COLUMN: Images & Unboxing (Desktop Only) */}
        <div className="flex flex-col gap-16">
            {/* Images - Sticky removed for better flow with video below */}
            <div className="space-y-2">
                {/* Main Media Container */}
                <div 
                    className={`aspect-[3/4] w-full overflow-hidden bg-stone-300 relative group ${activeMedia.type === 'image' ? 'md:cursor-zoom-in' : ''}`}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                    onClick={toggleZoom}
                >
                    {activeMedia.type === 'image' ? (
                        <img 
                            ref={mainImageRef}
                            src={activeMedia.src} 
                            alt={product.name} 
                            className={`w-full h-full object-cover select-none ${isCompletelySoldOut ? 'opacity-80' : ''}`}
                            width="600"
                            height="750"
                            loading="eager"
                            draggable="false"
                        />
                    ) : (
                        <video
                            src={activeMedia.src}
                            className="w-full h-full object-cover"
                            autoPlay
                            loop
                            muted
                            playsInline
                            controls={true}
                        />
                    )}

                    {isCompletelySoldOut && (
                        <div className="absolute inset-0 flex items-center justify-center bg-obsidian/10">
                            <span className="bg-white/90 px-6 py-3 text-sm font-bold uppercase tracking-widest text-obsidian border border-obsidian/10 shadow-lg">Sold Out</span>
                        </div>
                    )}

                    {/* Navigation Arrows (Visible on Mobile / Fade in on Desktop) */}
                    {mediaItems.length > 1 && (
                        <>
                            <button 
                                onClick={(e) => { e.stopPropagation(); handlePrevMedia(); }}
                                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white/40 backdrop-blur-md border border-white/50 rounded-full text-obsidian shadow-lg hover:bg-white/60 transition-all z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100"
                                aria-label="Previous image"
                            >
                                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 stroke-[1.5]" />
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleNextMedia(); }}
                                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white/40 backdrop-blur-md border border-white/50 rounded-full text-obsidian shadow-lg hover:bg-white/60 transition-all z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100"
                                aria-label="Next image"
                            >
                                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 stroke-[1.5]" />
                            </button>
                        </>
                    )}

                    {/* Desktop Zoom Hint (Only for Images) */}
                    {activeMedia.type === 'image' && (
                        <div className="hidden md:flex absolute bottom-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                            <ZoomIn className="w-5 h-5 text-obsidian drop-shadow-md" />
                        </div>
                    )}
                </div>
                
                {/* Thumbnails */}
                <div className="grid grid-cols-4 gap-2">
                    {mediaItems.map((item, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => setActiveMediaIndex(idx)}
                            className={`aspect-[3/4] overflow-hidden rounded-md transition-all duration-300 relative group ${activeMediaIndex === idx ? 'ring-2 ring-obsidian opacity-100' : 'opacity-60 hover:opacity-80'}`}
                        >
                            {item.type === 'image' ? (
                                <img src={item.src} className={`w-full h-full object-cover ${isCompletelySoldOut ? 'opacity-50' : ''}`} alt="" width="150" height="200" loading="lazy" />
                            ) : (
                                <div className="w-full h-full bg-stone-900 flex items-center justify-center relative">
                                    <video src={item.src} className="w-full h-full object-cover opacity-50" muted />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <PlayCircle className="w-8 h-8 text-white opacity-80 group-hover:opacity-100" />
                                    </div>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Unboxing Experience Section - DESKTOP ONLY (Left Column) */}
            {product.video && (
                <div className="w-full pt-8 border-t border-obsidian/5 hidden lg:block">
                    <div className="mb-6">
                        <span className="text-[10px] uppercase tracking-[0.2em] opacity-50 mb-2 block text-stone-500">The Ritual</span>
                        <h2 className="font-serif text-2xl text-obsidian">Unboxing Experience</h2>
                    </div>
                    <div className="w-full overflow-hidden rounded-xl bg-black shadow-lg">
                        <video 
                            src={product.video}
                            className="w-full h-auto block"
                            autoPlay
                            loop
                            muted
                            playsInline
                            controls={false}
                        />
                    </div>
                </div>
            )}
        </div>

        {/* RIGHT COLUMN: Details & Reviews */}
        <div className="flex flex-col pt-4">
            {/* Header */}
            <div className="mb-12 border-b border-obsidian/10 pb-8">
                <h1 className="font-serif text-3xl md:text-4xl mb-4">{product.name}</h1>
                <div className="flex flex-col items-start gap-3">
                    <PriceBadge price={product.price} compareAtPrice={product.compareAtPrice} className="text-lg md:text-xl px-6 py-2" />
                    {/* Stars */}
                    <div className="flex items-center gap-2 mt-1">
                        <StarRating rating={avgRating} size={16} />
                        <span className="text-xs text-stone-500 underline decoration-stone-300 underline-offset-4">
                            {productReviews.length} {productReviews.length === 1 ? 'Review' : 'Reviews'}
                        </span>
                        {totalStock < 10 && totalStock > 0 && (
                             <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 ml-3 bg-amber-50 px-2 py-0.5 rounded">
                                 Only {totalStock} Left
                             </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                {/* Size Selector */}
                <div>
                    <div className="flex justify-between mb-4">
                        <span className={`text-xs uppercase tracking-widest transition-colors duration-300 ${showSizeError ? 'text-red-700 font-bold' : 'opacity-60 text-obsidian'}`}>
                            {isCompletelySoldOut ? 'Sold Out' : (showSizeError ? 'Please Select a Size' : 'Select Size')}
                        </span>
                        <Link to="/faq" className="text-xs underline opacity-40 cursor-pointer hover:text-obsidian transition-colors">Size Guide & FAQ</Link>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {product.inventory.map(variant => {
                            const isVariantSoldOut = variant.stock <= 0;
                            return (
                                <LiquidButton
                                    key={variant.size}
                                    onClick={() => !isVariantSoldOut && handleSizeSelect(variant.size)}
                                    size="lg"
                                    variant={selectedSize === variant.size ? 'solid' : 'outline'}
                                    className={`min-w-[48px] h-12 p-0 px-2 ${
                                        selectedSize !== variant.size ? 'border-obsidian/30 hover:border-obsidian text-obsidian/80' : ''
                                    } ${
                                        showSizeError && selectedSize !== variant.size ? 'border-red-300 bg-red-50' : ''
                                    } ${isVariantSoldOut ? 'opacity-40 cursor-not-allowed hover:border-obsidian/30 border-dashed bg-stone-100' : ''}`}
                                    disabled={isVariantSoldOut}
                                    title={isVariantSoldOut ? 'Out of Stock' : `${variant.stock} left`}
                                >
                                    {variant.size}
                                </LiquidButton>
                            );
                        })}
                    </div>
                </div>

                {/* Actions (Always visible) */}
                <div className="flex flex-row gap-3 md:gap-4 w-full">
                    <LiquidButton
                        onClick={handleAddToCart}
                        variant={activeButton === 'cart' ? 'solid' : 'outline'}
                        className={`flex-1 h-12 md:h-14 px-2 md:px-6 text-[10px] md:text-xs uppercase tracking-widest font-semibold transition-all duration-300 ${
                            activeButton !== 'cart' ? 'border-obsidian/30 hover:border-obsidian text-obsidian/80' : ''
                        } ${
                            activeButton === 'cart' ? 'bg-emerald-800 border-emerald-800 text-white' : ''
                        } ${isCompletelySoldOut ? 'opacity-50 cursor-not-allowed hover:border-obsidian/30' : ''}`}
                        fullWidth
                        disabled={isCompletelySoldOut}
                    >
                        {isCompletelySoldOut ? 'Sold Out' : (activeButton === 'cart' ? 'Added' : 'Add to Cart')}
                    </LiquidButton>
                    <LiquidButton
                        onClick={handleBuyNow}
                        variant="solid"
                        className={`flex-1 h-12 md:h-14 px-2 md:px-6 text-[10px] md:text-xs uppercase tracking-widest font-semibold transition-all duration-300 ${
                             activeButton === 'buy' ? 'bg-emerald-800 border-emerald-800 text-white' : ''
                        } ${isCompletelySoldOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                        fullWidth
                        disabled={isCompletelySoldOut}
                    >
                        {isCompletelySoldOut ? 'Sold Out' : (activeButton === 'buy' ? 'Proceeding...' : 'Buy Now')}
                    </LiquidButton>
                </div>

                {/* Shipping & Returns Details */}
                <div className="mt-10 pt-8 border-t border-obsidian/10">
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                        {/* Free Shipping */}
                        <div className="bg-stone-50/50 p-3 md:p-4 rounded-lg border border-stone-200/50 flex flex-col items-start gap-2 md:gap-3 hover:border-stone-300 transition-colors h-full">
                            <Truck className="w-5 h-5 stroke-[1.5] text-obsidian" />
                            <div className="space-y-1">
                                <h4 className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-obsidian">Free Shipping*</h4>
                                <p className="text-[9px] md:text-[10px] text-stone-600 leading-relaxed">
                                    3–5 business days within Pakistan.
                                </p>
                                <p className="text-[8px] md:text-[9px] text-stone-400 opacity-60">*All orders nationwide</p>
                            </div>
                             <Link to="/shipping" className="mt-auto pt-2 flex items-center gap-1 text-[9px] md:text-[10px] font-medium text-stone-500 hover:text-obsidian group">
                                <span>Delivery Details</span>
                                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>

                        {/* Easy Returns */}
                        <div className="bg-stone-50/50 p-3 md:p-4 rounded-lg border border-stone-200/50 flex flex-col items-start gap-2 md:gap-3 hover:border-stone-300 transition-colors h-full">
                            <Package className="w-5 h-5 stroke-[1.5] text-obsidian" />
                            <div className="space-y-1">
                                <h4 className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-obsidian">Easy Returns</h4>
                                <p className="text-[9px] md:text-[10px] text-stone-600 leading-relaxed">
                                    14-day refund or store credit policy.
                                </p>
                            </div>
                            <Link to="/returns" className="mt-auto pt-2 flex items-center gap-1 text-[9px] md:text-[10px] font-medium text-stone-500 hover:text-obsidian group">
                                <span>Returns Policy</span>
                                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="mt-12 pt-12 border-t border-obsidian/10">
                {renderDescription(product.description)}
                
                <div className="mt-8 flex justify-center">
                    <Link to="/faq" className="flex items-center gap-2 px-6 py-3 bg-stone-100 rounded-full hover:bg-stone-200 transition-colors text-xs font-medium uppercase tracking-widest text-stone-600 hover:text-obsidian group">
                        <HelpCircle className="w-4 h-4 stroke-[1.5]" />
                        <span>Have questions? Read our FAQ</span>
                        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1 opacity-50" />
                    </Link>
                </div>
            </div>

            {/* Unboxing Experience Section - MOBILE ONLY (Moved here) */}
            {product.video && (
                <div className="mt-12 pt-8 border-t border-obsidian/10 lg:hidden">
                    <div className="mb-6">
                        <span className="text-[10px] uppercase tracking-[0.2em] opacity-50 mb-2 block text-stone-500">The Ritual</span>
                        <h2 className="font-serif text-2xl text-obsidian">Unboxing Experience</h2>
                    </div>
                    <div className="w-full overflow-hidden rounded-xl bg-black shadow-lg">
                        <video 
                            src={product.video}
                            className="w-full h-auto block"
                            autoPlay
                            loop
                            muted
                            playsInline
                            controls={false}
                        />
                    </div>
                </div>
            )}

            {/* REVIEWS SECTION - Moved to Right Column */}
            <div className="mt-16 pt-12 border-t border-obsidian/10">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="font-serif text-2xl text-obsidian">Reviews</h2>
                    <div className="flex items-center gap-2">
                        <StarRating rating={avgRating} size={16} />
                        <span className="text-sm font-medium">{avgRating.toFixed(1)} / 5</span>
                    </div>
                </div>

                {/* Review List */}
                <div className="space-y-6 mb-12">
                    {productReviews.length === 0 ? (
                        <div className="text-center text-stone-500 py-8 italic">No reviews yet. Be the first to share your thoughts.</div>
                    ) : (
                        productReviews.map(review => (
                            <div key={review.id} className="border-b border-stone-100 pb-6 last:border-0">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-sm text-obsidian">{review.userName}</h4>
                                        <StarRating rating={review.rating} size={12} className="mt-1" />
                                    </div>
                                    <span className="text-xs text-stone-400">{new Date(review.date).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-stone-600 leading-relaxed mt-2">{review.comment}</p>
                            </div>
                        ))
                    )}
                </div>

                {/* Review Form - Moved to Bottom */}
                <div className="bg-stone-50 p-6 md:p-8 rounded-xl border border-stone-200">
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Write a Review</h3>
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input 
                                required
                                placeholder="Your Name"
                                className="w-full bg-white border border-stone-300 rounded p-3 text-sm focus:outline-none focus:border-obsidian"
                                value={newReview.name}
                                onChange={e => setNewReview({...newReview, name: e.target.value})}
                            />
                            <div className="flex items-center gap-3 px-3 border border-stone-300 rounded bg-white h-[46px]">
                                <span className="text-xs text-stone-500 uppercase font-bold">Rating:</span>
                                <StarRating 
                                    rating={newReview.rating} 
                                    size={18} 
                                    interactive 
                                    onChange={r => setNewReview({...newReview, rating: r})} 
                                />
                            </div>
                        </div>
                        <textarea 
                            required
                            placeholder="Share your thoughts..."
                            className="w-full bg-white border border-stone-300 rounded p-3 text-sm focus:outline-none focus:border-obsidian h-24 resize-none"
                            value={newReview.comment}
                            onChange={e => setNewReview({...newReview, comment: e.target.value})}
                        />
                        <button 
                            type="submit" 
                            disabled={isSubmittingReview}
                            className="w-full bg-obsidian text-white py-3 text-xs uppercase tracking-widest font-bold rounded hover:bg-stone-800 disabled:opacity-50 transition-colors"
                        >
                            {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
      </div>

      {/* Related */}
      {relatedProducts.length > 0 && (
          <div className="mt-32 pt-16 border-t border-obsidian/5">
              <h3 className="font-serif text-2xl mb-12">You may also like</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedProducts.map(rp => {
                    const isOnSale = rp.compareAtPrice && rp.compareAtPrice > rp.price;
                    const discount = isOnSale ? Math.round(((rp.compareAtPrice! - rp.price) / rp.compareAtPrice!) * 100) : 0;

                    return (
                    <Link key={rp.id} to={`/product/${rp.id}`} className="group block flex flex-col items-start">
                         <div className="aspect-[3/4] bg-stone-300 mb-4 overflow-hidden rounded-md w-full relative">
                             <img src={rp.images[0]} className="w-full h-full object-cover transition-all duration-500" alt={rp.name} width="400" height="533" loading="lazy" />
                             {isOnSale && (
                                <div className="absolute top-2 left-2 bg-[#415941]/90 backdrop-blur px-2 py-1 text-[10px] uppercase tracking-widest text-white rounded-sm shadow-sm z-10">
                                    {discount}% OFF
                                </div>
                            )}
                         </div>
                         <h4 className="font-serif text-lg">{rp.name}</h4>
                         <PriceBadge price={rp.price} compareAtPrice={rp.compareAtPrice} className="mt-2" />
                    </Link>
                )})}
              </div>
          </div>
      )}

      {/* Desktop Zoom Modal - Only active for images */}
      {isZoomed && activeMedia.type === 'image' && (
        <div 
            className="fixed inset-0 z-[100] bg-obsidian/95 backdrop-blur-xl flex items-center justify-center animate-fade-in"
            onClick={() => setIsZoomed(false)}
        >
            {/* Close Button */}
            <button 
                className="absolute top-6 right-6 p-2 text-white/60 hover:text-white transition-colors"
                onClick={() => setIsZoomed(false)}
            >
                <X className="w-10 h-10 stroke-1" />
            </button>

            {/* Navigation Buttons */}
            <button 
                onClick={(e) => { e.stopPropagation(); handlePrevMedia(); }}
                className="hidden md:block absolute left-8 p-4 text-white/50 hover:text-white transition-colors hover:bg-white/5 rounded-full"
            >
                <ChevronLeft className="w-12 h-12 stroke-[0.5]" />
            </button>

            {/* Zoomed Image */}
            <img 
                src={activeMedia.src} 
                alt={product.name}
                className="max-h-[90vh] max-w-[90vw] object-contain shadow-2xl cursor-default select-none"
                onClick={(e) => e.stopPropagation()} 
            />

            <button 
                onClick={(e) => { e.stopPropagation(); handleNextMedia(); }}
                className="hidden md:block absolute right-8 p-4 text-white/50 hover:text-white transition-colors hover:bg-white/5 rounded-full"
            >
                <ChevronRight className="w-12 h-12 stroke-[0.5]" />
            </button>
            
            {/* Image Counter */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-sm tracking-widest uppercase font-sans">
                {activeMediaIndex + 1} / {mediaItems.length}
            </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;