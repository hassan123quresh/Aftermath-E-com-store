import React, { useEffect } from 'react';
import { useStore } from '../StoreContext';
import { Link } from 'react-router-dom';
import LiquidChrome from '../components/LiquidChrome';

const Home = () => {
  const { products } = useStore();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal-on-scroll').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[90vh] w-full overflow-hidden bg-obsidian">
        {/* Liquid Chrome Background */}
        <LiquidChrome
            baseColor={[0.1, 0.1, 0.1]}
            speed={0.4}
            amplitude={0.3}
            interactive={true}
        />

        {/* Cinematic Gradient Overlays to ensure text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20 pointer-events-none"></div>
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-100 z-10 px-4 pointer-events-none">
          {/* Removed animate-fade-in-up for instant visibility */}
          <div className="text-center pointer-events-auto flex flex-col items-center">
             <h1 
                className="text-6xl md:text-9xl font-serif tracking-tight mb-8 italic text-white"
                style={{ textShadow: '0 4px 10px rgba(0,0,0,0.9), 0 10px 30px rgba(0,0,0,0.8), 0 20px 60px rgba(0,0,0,0.6)' }}
             >
                Live within.
             </h1>
             <p className="text-xs md:text-sm tracking-[0.2em] uppercase opacity-80 mb-12 font-light font-sans text-stone-200" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                Stillness in motion
             </p>
             <Link 
                to="/shop" 
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group relative inline-flex items-center justify-center px-12 py-4 rounded-full transition-all duration-500 hover:scale-105 active:scale-95"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  boxShadow: `
                    0 8px 32px rgba(0, 0, 0, 0.3),
                    inset 0 0 0 1px rgba(255, 255, 255, 0.2),
                    inset 0 1px 0 0 rgba(255, 255, 255, 0.3)
                  `,
                }}
              >
                {/* Internal shine/highlight for liquid feel */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none" />
                
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white/10 blur-xl pointer-events-none" />

                <span 
                    className="relative z-10 text-xs font-serif uppercase tracking-[0.25em] text-white font-bold transition-colors" 
                    style={{ textShadow: '0 2px 4px rgba(0,0,0,1)' }}
                >
                  Enter Store
                </span>
              </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Carousel */}
      <section id="shop" className="py-32 w-full">
        {/* Header with See All button */}
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-end mb-20 reveal-on-scroll">
            <div className="flex items-baseline gap-6">
                <h2 className="font-serif text-4xl text-obsidian italic">Collection</h2>
                <Link 
                    to="/collection" 
                    className="hidden md:inline-flex items-center gap-2 text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-all group"
                >
                    See All <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </Link>
            </div>
            
            <div className="flex flex-col items-end gap-1">
                <Link 
                    to="/collection" 
                    className="md:hidden text-xs uppercase tracking-widest opacity-60 hover:opacity-100 border-b border-obsidian pb-1 mb-1"
                >
                    See All
                </Link>
                <span className="hidden md:block text-xs tracking-widest opacity-50 uppercase border-b border-obsidian pb-1 font-sans">
                    {products.length} Artifacts
                </span>
            </div>
        </div>
        
        {/* Horizontal Scroll Container */}
        {/* Mobile: w-[44%] ensures ~2 items visible. Desktop: w-[300px] or percentage for more items. */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-8 px-6 pb-12 w-full no-scrollbar max-w-7xl mx-auto">
          {products.map((product, idx) => (
            <Link 
                key={product.id} 
                to={`/product/${product.id}`} 
                className="relative flex-shrink-0 snap-start w-[44%] md:w-[320px] lg:w-[360px] group reveal-on-scroll"
                style={{ transitionDelay: `${idx * 100}ms` }}
            >
              {/* Image Container with Hover Swap */}
              <div className="relative aspect-[3/4] overflow-hidden mb-8 bg-stone-300 w-full">
                {/* Primary Image */}
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out opacity-100 group-hover:opacity-0"
                  width="360"
                  height="480"
                  loading={idx < 2 ? "eager" : "lazy"}
                />
                {/* Secondary Image (revealed on hover) */}
                <img 
                  src={product.images[1] || product.images[0]} 
                  alt={`${product.name} Detail`} 
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out opacity-0 group-hover:opacity-100"
                  width="360"
                  height="480"
                  loading="lazy"
                />
              </div>

              {/* Product Info */}
              <div className="flex flex-col items-center text-center space-y-2">
                <h3 className="font-medium text-lg md:text-2xl font-serif group-hover:text-stone-600 transition-colors duration-300 italic truncate w-full">{product.name}</h3>
                <p className="text-xs md:text-sm opacity-40 uppercase tracking-widest font-sans">{product.category}</p>
                <span className="text-sm md:text-lg opacity-80 mt-2 font-medium font-sans">PKR {product.price.toLocaleString()}</span>
              </div>
            </Link>
          ))}
          
          {/* Spacer to ensure last item isn't flush against the screen edge when scrolled */}
          <div className="w-2 flex-shrink-0" />
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="philosophy" className="bg-stone-200 py-40 px-6 relative overflow-hidden">
        {/* Subtle decorative element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-stone-300/30 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-3xl mx-auto text-center reveal-on-scroll">
          <h2 className="text-xs uppercase tracking-[0.3em] opacity-40 mb-12 font-sans">The Philosophy</h2>
          <p className="font-serif text-3xl md:text-5xl leading-tight text-obsidian/90 mb-12 italic">
            "Aftermath is not trend-driven fashion. It is clothing for stillness, reflection, and inner alignment."
          </p>
          <div className="w-px h-24 bg-obsidian/20 mx-auto"></div>
        </div>
      </section>
    </div>
  );
};

export default Home;