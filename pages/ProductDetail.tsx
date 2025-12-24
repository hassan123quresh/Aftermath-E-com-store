import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../StoreContext';
import { Truck, Package, ArrowRight } from 'lucide-react';
import { marked } from 'marked';
import katex from 'katex';
import createDOMPurify from 'dompurify';
import LiquidButton from '../components/LiquidButton';
import { PriceBadge } from '../components/PriceBadge';

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
  const { products, addToCart, toggleCart, showToast } = useStore();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [showSizeError, setShowSizeError] = useState(false);
  
  // State for button feedback
  const [activeButton, setActiveButton] = useState<'none' | 'cart' | 'buy'>('none');

  // Fix: Scroll to top when product page is opened or changed
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const product = products.find(p => p.id === id);

  if (!product) return <div className="h-screen flex items-center justify-center">Product not found.</div>;

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setShowSizeError(false);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setShowSizeError(true);
      return;
    }
    
    // Provide visual feedback
    setActiveButton('cart');
    addToCart(product, selectedSize);
    
    // Show toast
    showToast("Added to Cart", { label: "Click to Proceed", onClick: toggleCart });

    // Reset button state after delay
    setTimeout(() => {
      setActiveButton('none');
    }, 2000);
  };

  const handleBuyNow = () => {
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

  // Advanced Markdown Renderer
  const renderDescription = (text: string) => {
    if (!text) return null;
    try {
        const rawHtml = marked.parse(text) as string;
        // Use sanitizer if available, otherwise raw HTML (fallback)
        const cleanHtml = DOMPurify ? DOMPurify.sanitize(rawHtml, {
             ADD_TAGS: ['iframe', 'u'], // Allow iframes and underline
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
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
        {/* Images - Sticky functionality moved here for better scrolling experience */}
        <div className="space-y-2 lg:sticky lg:top-28">
            <div className="aspect-[3/4] w-full overflow-hidden bg-stone-300">
                <img 
                    src={product.images[activeImgIndex]} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                    width="600"
                    height="750"
                    loading="eager"
                />
            </div>
            <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, idx) => (
                    <button 
                        key={idx} 
                        onClick={() => setActiveImgIndex(idx)}
                        className={`aspect-[3/4] overflow-hidden rounded-md transition-all duration-300 ${activeImgIndex === idx ? 'ring-2 ring-obsidian opacity-100' : 'opacity-60 hover:opacity-80'}`}
                    >
                        <img src={img} className="w-full h-full object-cover" alt="" width="150" height="200" loading="lazy" />
                    </button>
                ))}
            </div>
        </div>

        {/* Details Column - Scrolls naturally */}
        <div className="flex flex-col pt-4">
            {/* Header */}
            <div className="mb-12 border-b border-obsidian/10 pb-8">
                <h1 className="font-serif text-3xl md:text-4xl mb-4">{product.name}</h1>
                <PriceBadge price={product.price} className="text-lg md:text-xl px-6 py-2" />
            </div>

            <div className="space-y-8">
                {/* Size Selector */}
                <div>
                    <div className="flex justify-between mb-4">
                        <span className={`text-xs uppercase tracking-widest transition-colors duration-300 ${showSizeError ? 'text-red-700 font-bold' : 'opacity-60 text-obsidian'}`}>
                            {showSizeError ? 'Please Select a Size' : 'Select Size'}
                        </span>
                        <span className="text-xs underline opacity-40 cursor-pointer hover:text-obsidian transition-colors">Size Guide</span>
                    </div>
                    <div className="flex gap-4">
                        {product.sizes.map(size => (
                            <LiquidButton
                                key={size}
                                onClick={() => handleSizeSelect(size)}
                                size="lg"
                                variant={selectedSize === size ? 'solid' : 'outline'}
                                className={`w-12 h-12 p-0 ${
                                    showSizeError && selectedSize !== size ? 'border-red-300 bg-red-50' : ''
                                }`}
                            >
                                {size}
                            </LiquidButton>
                        ))}
                    </div>
                </div>

                {/* Actions (Always visible) */}
                <div className="flex flex-row gap-3 md:gap-4 w-full">
                    <LiquidButton
                        onClick={handleAddToCart}
                        variant={activeButton === 'cart' ? 'solid' : 'outline'}
                        className={`flex-1 h-12 md:h-14 px-2 md:px-6 text-[10px] md:text-xs uppercase tracking-widest font-semibold transition-all duration-300 ${
                            activeButton === 'cart' ? 'bg-emerald-800 border-emerald-800 text-white' : ''
                        }`}
                        fullWidth
                    >
                        {activeButton === 'cart' ? 'Added' : 'Add to Cart'}
                    </LiquidButton>
                    <LiquidButton
                        onClick={handleBuyNow}
                        variant="solid"
                        className={`flex-1 h-12 md:h-14 px-2 md:px-6 text-[10px] md:text-xs uppercase tracking-widest font-semibold transition-all duration-300 ${
                             activeButton === 'buy' ? 'bg-emerald-800 border-emerald-800 text-white' : ''
                        }`}
                        fullWidth
                    >
                        {activeButton === 'buy' ? 'Proceeding...' : 'Buy Now'}
                    </LiquidButton>
                </div>

                {/* Shipping & Returns Details - Single Row Layout on All Screens */}
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

            {/* Description (Moved to bottom) */}
            <div className="mt-12 pt-12 border-t border-obsidian/10">
                {renderDescription(product.description)}
            </div>
        </div>
      </div>

      {/* Related */}
      {relatedProducts.length > 0 && (
          <div className="mt-32 pt-16 border-t border-obsidian/5">
              <h3 className="font-serif text-2xl mb-12">You may also like</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedProducts.map(rp => (
                    <Link key={rp.id} to={`/product/${rp.id}`} className="group block flex flex-col items-start">
                         <div className="aspect-[3/4] bg-stone-300 mb-4 overflow-hidden rounded-md w-full">
                             <img src={rp.images[0]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={rp.name} width="400" height="533" loading="lazy" />
                         </div>
                         <h4 className="font-serif text-lg">{rp.name}</h4>
                         <PriceBadge price={rp.price} className="mt-2" />
                    </Link>
                ))}
              </div>
          </div>
      )}
    </div>
  );
};

export default ProductDetail;