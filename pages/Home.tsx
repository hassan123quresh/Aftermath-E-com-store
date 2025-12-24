import React, { useEffect } from 'react';
import { useStore } from '../StoreContext';
import { Link, useNavigate } from 'react-router-dom';
import LiquidChrome from '../components/LiquidChrome';
import { HeroLiquidButton } from '../components/HeroLiquidButton';
import LiquidButton from '../components/LiquidButton';
import { PriceBadge } from '../components/PriceBadge';

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
        <div className="max-w-7xl mx-auto">
            
            {/* Header - Fixed Alignment (items-start on mobile to align left) */}
            <div className="px-6 md:px-12 flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 reveal-on-scroll">
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
            
            {/* Scroll Container - Matching padding to header for perfect alignment */}
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 md:gap-12 px-6 md:px-12 pb-12 w-full no-scrollbar">
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
                  <div className="flex flex-col items-start gap-2">
                      <div className="flex justify-between w-full items-start">
                          <h3 className="font-serif text-2xl md:text-3xl text-obsidian leading-none group-hover:underline underline-offset-4 decoration-1 decoration-stone-300 transition-all max-w-[60%]">{product.name}</h3>
                          <PriceBadge price={product.price} />
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
            <div className="px-6 md:px-12 md:hidden mt-8">
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

      {/* NEW ARTISTIC EDITORIAL SECTION: After Hours / 1 */}
      <section className="bg-[#E6E5E1] text-[#1a1918] relative w-full border-t border-stone-200">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-24 md:py-40">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
                
                {/* LEFT COLUMN - STICKY (The Philosophy) */}
                <div className="lg:col-span-5 lg:sticky lg:top-32 h-fit">
                    <div className="flex flex-col items-start reveal-on-scroll">
                        <span className="inline-block py-1 px-3 border border-[#1a1918]/20 rounded-full text-[10px] uppercase tracking-[0.2em] font-medium mb-8">
                            After Hours / 01
                        </span>
                        
                        <h2 className="text-7xl md:text-[8rem] leading-[0.8] font-serif mb-12 -ml-1 text-obsidian tracking-tight">
                            Live<br/>within.
                        </h2>

                        <div className="prose prose-lg md:prose-xl font-serif text-[#1a1918]/80 leading-relaxed max-w-md">
                            <p>
                            In a world that feels increasingly externalised, overstimulated, and optimised, Aftermath centers the parts of you left behind by the pace.
                            </p>
                            <p className="indent-12">
                            It reflects the part of you that does not chase. The slow part. The internal rhythm. Where slowing down lets clarity in.
                            </p>
                            <p className="text-sm font-sans uppercase tracking-widest mt-8 opacity-60 not-prose">
                            This is not about escape. This is about being here fully.
                            </p>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN - SCROLLING (The Visuals & Details) */}
                <div className="lg:col-span-7 flex flex-col gap-32 lg:pt-20">
                    
                    {/* Visual 1 - Main Hero */}
                    <div className="w-full relative group reveal-on-scroll">
                        <div className="aspect-[4/5] overflow-hidden bg-[#dcdbd7]">
                            <img 
                                src="https://cdn.shopify.com/s/files/1/0944/5933/0923/files/blog_p_aftermathArtboard_3_600x600.jpg?v=1763682137" 
                                alt="The Silence"
                                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                                loading="lazy"
                            />
                        </div>
                        <div className="flex justify-between items-start mt-4 border-t border-[#1a1918]/10 pt-4">
                            <span className="text-[10px] uppercase tracking-widest opacity-50">Fig. 01 — Stillness</span>
                            <p className="text-sm font-serif italic max-w-xs text-right opacity-70">
                                "It is the name for those hours when the pace drops, the noise fades a little."
                            </p>
                        </div>
                    </div>

                    {/* Text Block 1 - Interspersed */}
                    <div className="w-full md:w-2/3 self-end reveal-on-scroll">
                        <p className="font-sans text-sm md:text-base leading-loose tracking-wide opacity-80">
                            <span className="font-bold">Live within</span> is the idea that sits quietly behind Aftermath. Not a big moment or a dramatic shift, just the simple feeling of being back in your own head and in your own body, without needing to explain it.
                        </p>
                    </div>

                    {/* Visual 2 & 3 - Asymmetric Grid */}
                    <div className="grid grid-cols-12 gap-6 items-end reveal-on-scroll">
                        <div className="col-span-5">
                            <div className="aspect-[3/4] overflow-hidden bg-[#dcdbd7] mb-4 relative group">
                                <img 
                                    src="https://aftermathstore.com/cdn/shop/files/blog_p_aftermathArtboard_1.jpg?v=1763682128&width=600" 
                                    alt="Texture"
                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                    loading="lazy"
                                />
                            </div>
                            <span className="text-[10px] uppercase tracking-widest opacity-50 block">Fig. 02 — Texture</span>
                        </div>
                        <div className="col-span-7 pb-12">
                            <div className="aspect-square overflow-hidden bg-[#dcdbd7] mb-4 relative group">
                                <img 
                                    src="https://cdn.shopify.com/s/files/1/0944/5933/0923/files/blog_p_aftermathArtboard_2_600x600.jpg?v=1763682123" 
                                    alt="Detail"
                                    className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                                    loading="lazy"
                                />
                            </div>
                            <span className="text-[10px] uppercase tracking-widest opacity-50 block text-right">Fig. 03 — Form</span>
                        </div>
                    </div>

                    {/* Final Text Block - Philosophical Conclusion */}
                    <div className="w-full md:w-3/4 self-start reveal-on-scroll border-l-2 border-[#1a1918] pl-8 py-2">
                        <p className="font-serif text-xl md:text-2xl leading-relaxed text-[#1a1918]">
                            "The silhouettes stay clean so you do not have to think about them. The clothes are there to move with you while you read, make, reset, or simply sit."
                        </p>
                        <p className="mt-6 text-xs font-sans uppercase tracking-widest opacity-50">
                            Live within is not a performance or a goal.
                        </p>
                        <p className="mt-2 text-xs font-sans uppercase tracking-widest opacity-50">
                            It is a reminder that the inner world matters.
                        </p>
                    </div>

                </div>
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