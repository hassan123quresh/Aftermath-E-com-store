import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../StoreContext';
import { Truck, Package } from 'lucide-react';
import { marked } from 'marked';
import katex from 'katex';
import DOMPurify from 'dompurify';

// Configure marked with a custom tokenizer for math ($...$ and $$...$$)
const mathExtension = {
    name: 'math',
    level: 'inline',
    start(src: string) { return src.match(/\$/)?.index; },
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
        return katex.renderToString(token.text, {
            displayMode: token.display,
            throwOnError: false,
            output: 'html'
        });
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
  const { products, addToCart, toggleCart } = useStore();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [showSizeError, setShowSizeError] = useState(false);

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
    addToCart(product, selectedSize);
  };

  const handleBuyNow = () => {
      if (!selectedSize) {
        setShowSizeError(true);
        return;
      }
      addToCart(product, selectedSize);
      toggleCart(); // Close the cart drawer that automatically opens
      navigate('/checkout');
  };

  // Advanced Markdown Renderer
  const renderDescription = (text: string) => {
    if (!text) return null;
    try {
        const rawHtml = marked.parse(text) as string;
        const cleanHtml = DOMPurify.sanitize(rawHtml, {
             ADD_TAGS: ['iframe', 'u'], // Allow iframes and underline
             ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling']
        });
        
        return (
            <div 
                className="prose prose-stone prose-sm md:prose-base max-w-none 
                           prose-headings:font-serif prose-headings:font-normal prose-headings:text-obsidian
                           prose-p:text-obsidian prose-p:opacity-80 prose-p:leading-relaxed
                           prose-a:text-obsidian prose-a:underline prose-a:underline-offset-2
                           prose-strong:text-obsidian prose-strong:font-bold
                           prose-em:font-serif prose-em:italic
                           prose-ul:list-disc prose-ol:list-decimal
                           prose-li:marker:text-stone-400
                           prose-table:w-full prose-table:text-left prose-table:border-collapse
                           prose-th:p-3 prose-th:bg-stone-100 prose-th:font-serif prose-th:font-medium prose-th:text-xs prose-th:uppercase prose-th:tracking-widest
                           prose-td:p-3 prose-td:border-b prose-td:border-stone-100 prose-td:text-sm
                           [&_blockquote]:border-l-2 [&_blockquote]:border-obsidian [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:opacity-70"
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        {/* Images */}
        <div className="space-y-2">
            <div className="aspect-[3/4] w-full overflow-hidden bg-stone-300">
                <img 
                    src={product.images[activeImgIndex]} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, idx) => (
                    <button 
                        key={idx} 
                        onClick={() => setActiveImgIndex(idx)}
                        className={`aspect-[3/4] overflow-hidden rounded-md transition-all duration-300 ${activeImgIndex === idx ? 'ring-2 ring-obsidian opacity-100' : 'opacity-60 hover:opacity-80'}`}
                    >
                        <img src={img} className="w-full h-full object-cover" alt="" />
                    </button>
                ))}
            </div>
        </div>

        {/* Details Column */}
        <div className="flex flex-col h-full pt-4 lg:sticky lg:top-32">
            {/* Header */}
            <div className="mb-12 border-b border-obsidian/10 pb-8">
                <h1 className="font-serif text-3xl md:text-4xl mb-2">{product.name}</h1>
                <p className="text-xl opacity-70">PKR {product.price.toLocaleString()}</p>
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
                            <button
                                key={size}
                                onClick={() => handleSizeSelect(size)}
                                className={`w-12 h-12 flex items-center justify-center text-sm rounded-lg transition-all duration-300 ${
                                    selectedSize === size 
                                    ? 'btn-glass-dark font-medium scale-110 shadow-lg' 
                                    : showSizeError 
                                        ? 'border border-red-300 text-red-900 bg-red-50 hover:border-red-500' 
                                        : 'btn-glass hover:scale-105'
                                }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Actions (Always visible) */}
                <div className="flex flex-col md:flex-row gap-4">
                    <button
                        onClick={handleAddToCart}
                        className="flex-1 py-4 text-xs uppercase tracking-widest btn-glass rounded-full font-semibold"
                    >
                        Add to Cart
                    </button>
                    <button
                        onClick={handleBuyNow}
                        className="flex-1 py-4 text-xs uppercase tracking-widest btn-glass-dark rounded-full font-semibold"
                    >
                        Buy Now
                    </button>
                </div>

                {/* Shipping & Returns Details */}
                <div className="mt-10 pt-8 border-t border-obsidian/10 space-y-6">
                    {/* Free Shipping */}
                    <div className="flex gap-5 items-start">
                        <Truck className="w-6 h-6 stroke-[1.5] text-obsidian flex-shrink-0" />
                        <div className="space-y-1">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-obsidian">Free Shipping*</h4>
                            <p className="text-xs text-stone-600 leading-relaxed">
                                Expected time to arrive <span className="font-semibold text-emerald-800">3–5 business days</span>.
                            </p>
                             <p className="text-[10px] text-stone-400 leading-relaxed">
                                *Free on all orders within Pakistan.
                            </p>
                            <Link to="/shipping" className="text-[10px] text-stone-500 underline decoration-stone-300 hover:text-obsidian hover:decoration-obsidian transition-all block mt-1">
                                Delivery Details
                            </Link>
                        </div>
                    </div>

                    {/* Easy Returns */}
                    <div className="flex gap-5 items-start">
                        <Package className="w-6 h-6 stroke-[1.5] text-obsidian flex-shrink-0" />
                        <div className="space-y-1">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-obsidian">Easy Returns</h4>
                            <p className="text-xs text-stone-600 leading-relaxed">
                                Return for a refund or store credit within 14 days of the delivery date.
                            </p>
                            <Link to="/returns" className="text-[10px] text-stone-500 underline decoration-stone-300 hover:text-obsidian hover:decoration-obsidian transition-all block mt-1">
                                Returns Policy
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
                    <Link key={rp.id} to={`/product/${rp.id}`} className="group block">
                         <div className="aspect-[3/4] bg-stone-300 mb-4 overflow-hidden rounded-md">
                             <img src={rp.images[0]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={rp.name} />
                         </div>
                         <h4 className="font-serif text-lg">{rp.name}</h4>
                         <p className="text-sm opacity-60">PKR {rp.price.toLocaleString()}</p>
                    </Link>
                ))}
              </div>
          </div>
      )}
    </div>
  );
};

export default ProductDetail;