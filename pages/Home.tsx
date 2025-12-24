import React, { useEffect } from 'react';
import { useStore } from '../StoreContext';
import { Link, useNavigate } from 'react-router-dom';
import LiquidChrome from '../components/LiquidChrome';
import { HeroLiquidButton } from '../components/HeroLiquidButton';
import LiquidButton from '../components/LiquidButton';

const Home = () => {
  const { products } = useStore();
  const navigate = useNavigate();

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

  const handleEnterStore = () => {
      const shopElement = document.getElementById('shop');
      if (shopElement) {
          shopElement.scrollIntoView({ behavior: 'smooth' });
      }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden bg-obsidian">
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
                className="text-6xl md:text-9xl font-serif tracking-tight mb-8 text-white"
                style={{ textShadow: '0 4px 10px rgba(0,0,0,0.9), 0 10px 30px rgba(0,0,0,0.8), 0 20px 60px rgba(0,0,0,0.6)' }}
             >
                Live within.
             </h1>
             <p className="text-xs md:text-sm tracking-[0.2em] uppercase opacity-80 mb-12 font-light font-sans text-stone-200" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                Stillness in motion
             </p>
             
             <HeroLiquidButton 
                onClick={handleEnterStore}
                className="px-12 py-4 min-w-[200px]"
             >
                Enter Store
             </HeroLiquidButton>
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <div className="bg-obsidian text-stone-300 py-3 md:py-4 overflow-hidden relative z-20 border-t border-stone-800">
         <div className="flex whitespace-nowrap animate-marquee">
             {[...Array(20)].map((_, i) => (
                <span key={i} className="mx-8 text-[10px] md:text-xs font-sans uppercase tracking-[0.3em] font-medium flex items-center gap-8 opacity-80">
                   FREE SHIPPING ALL OVER PAKISTAN <span className="w-1 h-1 rounded-full bg-stone-600"></span>
                </span>
             ))}
         </div>
      </div>
      <style>{`
        .animate-marquee {
            animation: marquee 12s linear infinite;
        }
        @media (min-width: 768px) {
            .animate-marquee {
                animation: marquee 20s linear infinite;
            }
        }
        @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* Featured Products Carousel - Redesigned for Luxury */}
      <section id="shop" className="py-24 md:py-40 w-full bg-stone-50/50">
        <div className="max-w-[1800px] mx-auto">
            
            {/* Header - Increased Padding to move away from margin */}
            <div className="px-14 md:px-40 flex flex-col md:flex-row justify-between items-end mb-12 md:mb-20 reveal-on-scroll">
                <div className="max-w-xl">
                    <h2 className="font-serif text-4xl md:text-7xl text-obsidian mb-4 md:mb-6">The Collection</h2>
                    <p className="text-xs md:text-sm text-stone-500 max-w-sm leading-relaxed tracking-wide font-sans">
                        Essential pieces designed for the modern minimalist. Structured for presence, softened for comfort.
                    </p>
                </div>
                
                <Link 
                    to="/collection" 
                    className="group hidden md:flex items-center gap-4 pb-1 border-b border-obsidian/20 hover:border-obsidian transition-colors duration-500"
                >
                    <span className="text-xs font-medium uppercase tracking-[0.2em]">View All Artifacts</span>
                    <span className="group-hover:translate-x-2 transition-transform duration-500">→</span>
                </Link>
            </div>
            
            {/* Scroll Container - Increased Padding & Reduced Card Size */}
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 md:gap-12 px-14 md:px-40 pb-12 w-full no-scrollbar">
              {products.map((product, idx) => (
                <Link 
                    key={product.id} 
                    to={`/product/${product.id}`} 
                    className="relative flex-shrink-0 snap-start w-[75vw] md:w-[360px] group reveal-on-scroll cursor-pointer"
                    style={{ transitionDelay: `${idx * 100}ms` }}
                >
                  {/* Image */}
                  <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-stone-200 w-full">
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                      loading={idx < 3 ? "eager" : "lazy"}
                    />
                    {/* Hover Image */}
                    <img 
                      src={product.images[1] || product.images[0]} 
                      alt={product.name} 
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out opacity-0 group-hover:opacity-100"
                      loading="lazy"
                    />
                  </div>

                  {/* Info - Clean & Editorial */}
                  <div className="flex flex-col items-start gap-1">
                      <div className="flex justify-between w-full items-start">
                          <h3 className="font-serif text-2xl md:text-3xl text-obsidian leading-none group-hover:underline underline-offset-4 decoration-1 decoration-stone-300 transition-all max-w-[70%]">{product.name}</h3>
                          {/* Price more prominent: Larger, Serif, Bolder */}
                          <span className="text-lg md:text-xl font-serif font-medium text-obsidian whitespace-nowrap">PKR {product.price.toLocaleString()}</span>
                      </div>
                      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium">{product.category}</p>
                  </div>
                </Link>
              ))}
              
              {/* CTA Card at the end - Resized */}
              <Link to="/collection" className="flex-shrink-0 snap-start w-[75vw] md:w-[360px] aspect-[3/4] flex flex-col items-center justify-center bg-stone-100 border border-stone-200 hover:bg-stone-200 transition-colors group cursor-pointer">
                  <span className="font-serif text-3xl md:text-4xl mb-4 text-obsidian">View All</span>
                  <span className="text-xs uppercase tracking-widest border-b border-obsidian/20 group-hover:border-obsidian pb-1 transition-colors">Discover the archive</span>
              </Link>
              
              <div className="w-6 md:w-12 flex-shrink-0" />
            </div>
            
             {/* Mobile View All Link - Adjusted Padding */}
            <div className="px-14 md:hidden mt-8">
                 <Link 
                    to="/collection" 
                    className="flex items-center justify-between w-full py-6 border-t border-stone-200 group"
                >
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-obsidian">View Full Collection</span>
                    <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                </Link>
            </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="philosophy" className="bg-stone-200 py-40 px-6 relative overflow-hidden">
        {/* Subtle decorative element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-stone-300/30 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-3xl mx-auto text-center reveal-on-scroll">
          <h2 className="text-xs uppercase tracking-[0.3em] opacity-40 mb-12 font-sans">The Philosophy</h2>
          <p className="font-serif text-3xl md:text-5xl leading-tight text-obsidian/90 mb-12">
            "Aftermath is not trend-driven fashion. It is clothing for stillness, reflection, and inner alignment."
          </p>
          <div className="w-px h-24 bg-obsidian/20 mx-auto"></div>
        </div>
      </section>
    </div>
  );
};

export default Home;