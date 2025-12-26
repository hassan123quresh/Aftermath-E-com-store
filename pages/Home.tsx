import React, { useEffect, useRef } from 'react';
import { useStore } from '../StoreContext';
import { Link, useNavigate } from 'react-router-dom';
import LiquidChrome from '../components/LiquidChrome';
import { HeroLiquidButton } from '../components/HeroLiquidButton';
import LiquidButton from '../components/LiquidButton';
import { PriceBadge } from '../components/PriceBadge';
import { ProductPreview } from '../components/ProductPreview';
import ThreeDCarousel, { ThreeDCarouselItem } from '../components/ThreeDCarousel';
import { Maximize, ShieldCheck, Layers, Droplets, Fingerprint, Scissors, Zap, Box, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const Home = () => {
  const { products } = useStore();
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  const articleTop = [
    {
      title: { text: "Studio Fleece", className: "text-stone-100" },
      description: { text: "The definitive silhouette. Drop shoulders, voluminous sleeves, and a cropped body for a structured aesthetic.", className: "" },
      icon: <Layers className="w-8 h-8 md:w-12 md:h-12 stroke-1" />,
    },
    {
      title: { text: "Heavyweight Knit", className: "text-stone-100" },
      description: { text: "500 GSM French Terry construction. Dense, durable, and exceptionally soft against the skin.", className: "" },
      icon: <Fingerprint className="w-8 h-8 md:w-12 md:h-12 stroke-1" />,
    },
    {
      title: { text: "Modular Fit", className: "text-stone-100" },
      description: { text: "Engineered for layering. A generous cut that maintains its shape while allowing freedom of motion.", className: "" },
      icon: <Maximize className="w-8 h-8 md:w-12 md:h-12 stroke-1" />,
    },
    {
      title: { text: "Artisanal Finish", className: "text-stone-100" },
      description: { text: "Hand-distressed hems and reinforced double-stitching. Built to last a lifetime, not just a season.", className: "" },
      icon: <Scissors className="w-8 h-8 md:w-12 md:h-12 stroke-1" />,
    },
  ];

  const articleBottom = [
    {
      title: { text: "Storm Grey", className: "text-stone-100" },
      description: { text: "Cold-dyed for a weathered, industrial finish that captures the essence of the city.", className: "" },
      icon: <Zap className="w-8 h-8 md:w-12 md:h-12 stroke-1" />,
    },
    {
      title: { text: "Obsidian Dye", className: "text-stone-100" },
      description: { text: "True black pigmentation that absorbs light. Pre-shrunk to ensure perfect fit retention.", className: "" },
      icon: <Droplets className="w-8 h-8 md:w-12 md:h-12 stroke-1" />,
    },
    {
      title: { text: "Bone Colorway", className: "text-stone-100" },
      description: { text: "A soft, neutral tone inspired by raw cotton. Versatile enough for any rotation.", className: "" },
      icon: <Box className="w-8 h-8 md:w-12 md:h-12 stroke-1" />,
    },
    {
      title: { text: "The Aftermath", className: "text-stone-100" },
      description: { text: "Clothing for the quiet moments after the noise. Designed for stillness.", className: "" },
      icon: <ShieldCheck className="w-8 h-8 md:w-12 md:h-12 stroke-1" />,
    },
  ];

  const previewImages = [
      "https://res.cloudinary.com/dacyy7rkn/image/upload/f_auto,q_auto,w_800/v1766659171/image_6_xbcp7l.png",
      "https://res.cloudinary.com/dacyy7rkn/image/upload/f_auto,q_auto,w_800/v1766658178/image_2_afb7wq.png",
      "https://res.cloudinary.com/dacyy7rkn/image/upload/f_auto,q_auto,w_800/v1766658939/image_4_gtjbub.png",
      "https://res.cloudinary.com/dacyy7rkn/image/upload/f_auto,q_auto,w_800/v1766659072/image_5_kkzsh6.png"
  ];

  // UPDATED GLOW COLORS:
  // 1: Red
  // 2: White
  // 3: Cream (Default)
  // 4: White
  const glowColors = [
      "#dc2626", // RED
      "#ffffff", // WHITE
      "#d6d3d1", // CREAM
      "#ffffff"  // WHITE
  ];

  const testimonials = [
      { name: "hassan", comment: "lowkey the best purchase ive made in a min." },
      { name: "zoya", comment: "fabric is stupid soft i wear it everyday." },
      { name: "bilal", comment: "fit is boxy just how i like it, sleeves go crazy." },
      { name: "mira", comment: "took long to ship but quality makes up for it ig." },
      { name: "ali", comment: "honestly wasnt expecting it to be this heavy." },
      { name: "sameer", comment: "packaging went hard ngl felt bad opening it." },
      { name: "fatima", comment: "dropped it in the wash and it didnt shrink, blessed." },
      { name: "hamza", comment: "need this in every color fr." }
  ];

  const magazineItems: ThreeDCarouselItem[] = [
    {
      id: 1,
      title: "The Architecture of Silence",
      category: "Philosophy",
      description: "Exploring the quiet spaces between noise and how our environment shapes our internal rhythm.",
      imageUrl: "https://cdn.shopify.com/s/files/1/0944/5933/0923/files/blog_p_aftermathArtboard_3_600x600.jpg?v=1763682137",
      link: "/journal/1"
    },
    {
      id: 2,
      title: "Fabric as a Second Skin",
      category: "Material",
      description: "Why we chose 500 GSM French Terry for our Studio Collection. A deep dive into material science.",
      imageUrl: "https://aftermathstore.com/cdn/shop/files/STUDIO_CUT_AND_STUDIO_QUARTERArtboard1copy5.jpg?v=1763585095&width=800",
      link: "/journal/2"
    },
    {
      id: 3,
      title: "Forms of Stillness",
      category: "Editorial",
      description: "A visual study of the human form at rest. How clothing interacts with the body in moments of pause.",
      imageUrl: "https://cdn.shopify.com/s/files/1/0944/5933/0923/files/blog_p_aftermathArtboard_2_600x600.jpg?v=1763682123",
      link: "/journal"
    },
    {
      id: 4,
      title: "The Texture of Time",
      category: "Process",
      description: "Understanding the aging process of high-quality cotton and why wear creates character.",
      imageUrl: "https://aftermathstore.com/cdn/shop/files/blog_p_aftermathArtboard_1.jpg?v=1763682128&width=600",
      link: "/journal"
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden bg-obsidian">
        <LiquidChrome
            baseColor={[0.1, 0.1, 0.1]}
            speed={0.4}
            amplitude={0.3}
            interactive={true}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20 pointer-events-none"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-100 z-10 px-4 pointer-events-none">
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

      {/* Featured Products */}
      <section id="shop" className="py-24 md:py-40 w-full bg-stone-50/50">
        <div className="max-w-7xl mx-auto">
            <div className="px-8 md:px-12 flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 reveal-on-scroll">
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
            
            {/* Mobile Swipe Hint */}
            <div className="md:hidden px-8 mb-4 flex items-center gap-2 animate-pulse opacity-60">
                <span className="text-[10px] uppercase tracking-widest text-stone-500 font-medium">Swipe Left to Explore</span>
                <ArrowRight className="w-3 h-3 text-stone-500" />
            </div>

            <div className="relative group">
                {/* Desktop Navigation Buttons */}
                <button 
                    onClick={scrollLeft}
                    className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur border border-stone-200 rounded-full items-center justify-center hover:bg-obsidian hover:text-white transition-all duration-300 shadow-xl opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label="Scroll Left"
                >
                    <ChevronLeft className="w-5 h-5 stroke-[1.5]" />
                </button>
                <button 
                    onClick={scrollRight}
                    className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur border border-stone-200 rounded-full items-center justify-center hover:bg-obsidian hover:text-white transition-all duration-300 shadow-xl opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label="Scroll Right"
                >
                    <ChevronRight className="w-5 h-5 stroke-[1.5]" />
                </button>

                <div 
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto snap-x snap-mandatory gap-6 md:gap-12 px-8 md:px-12 pb-12 w-full no-scrollbar scroll-smooth"
                >
                {products.map((product, idx) => (
                    <Link 
                        key={product.id} 
                        to={`/product/${product.id}`} 
                        className="relative flex-shrink-0 snap-start w-[80vw] md:w-[360px] group reveal-on-scroll cursor-pointer"
                        style={{ transitionDelay: `${idx * 100}ms` }}
                    >
                    <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-stone-200 w-full">
                        <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                        loading={idx < 3 ? "eager" : "lazy"}
                        />
                        <img 
                        src={product.images[1] || product.images[0]} 
                        alt={product.name} 
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out opacity-0 group-hover:opacity-100"
                        loading="lazy"
                        />
                    </div>
                    <div className="flex flex-col items-start gap-2">
                        <div className="flex justify-between w-full items-start">
                            <h3 className="font-serif text-2xl md:text-3xl text-obsidian leading-none group-hover:underline underline-offset-4 decoration-1 decoration-stone-300 transition-all max-w-[60%]">{product.name}</h3>
                            <PriceBadge price={product.price} />
                        </div>
                        <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium">{product.category}</p>
                    </div>
                    </Link>
                ))}
                
                <Link to="/collection" className="flex-shrink-0 snap-start w-[80vw] md:w-[360px] aspect-[3/4] flex flex-col items-center justify-center bg-stone-100 border border-stone-200 hover:bg-stone-200 transition-colors group cursor-pointer">
                    <span className="font-serif text-3xl md:text-4xl mb-4 text-obsidian">View All</span>
                    <span className="text-xs uppercase tracking-widest border-b border-obsidian/20 group-hover:border-obsidian pb-1 transition-colors">Discover the archive</span>
                </Link>
                <div className="w-8 md:w-12 flex-shrink-0" />
                </div>
            </div>
            
            <div className="px-8 md:px-12 md:hidden mt-8">
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

      {/* PRODUCT PREVIEW / SPECIFICATIONS SCROLL */}
      <section className="w-full bg-obsidian border-t border-stone-800">
        <div className="w-full h-40 bg-obsidian text-stone-300 flex justify-center items-center px-3 border-b border-stone-800/50">
             <span className="text-xs uppercase tracking-[0.3em] opacity-80 animate-pulse">Scroll to Explore Details</span>
        </div>
        <ProductPreview
            productImages={previewImages}
            glowColors={glowColors}
            articleTop={articleTop}
            articleBottom={articleBottom}
            start="top top"
            rotate={0} 
            scaleFactor={1}
        />
      </section>

      {/* Editorial Section */}
      <section className="bg-[#E6E5E1] text-[#1a1918] relative w-full border-t border-stone-200">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-24 md:py-40">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
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

                <div className="lg:col-span-7 flex flex-col gap-12 lg:pt-20">
                    {/* Replaced static images with 3D Carousel */}
                    <div className="w-full relative group reveal-on-scroll">
                        <ThreeDCarousel items={magazineItems} />
                        
                        <div className="flex justify-center mt-12">
                            <Link 
                                to="/journal" 
                                className="group relative inline-flex items-center gap-3 px-8 py-3 bg-transparent border border-obsidian rounded-full overflow-hidden transition-colors hover:bg-obsidian hover:text-white"
                            >
                                <span className="relative z-10 text-xs uppercase tracking-widest font-bold">Explore More Magazines</span>
                                <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    <div className="w-full md:w-3/4 self-start reveal-on-scroll border-l-2 border-[#1a1918] pl-8 py-2 mt-12">
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-stone-300/30 rounded-full blur-3xl -z-10"></div>
        <div className="max-w-3xl mx-auto text-center reveal-on-scroll">
          <h2 className="text-xs uppercase tracking-[0.3em] opacity-40 mb-12 font-sans">The Philosophy</h2>
          <p className="font-serif text-3xl md:text-5xl leading-tight text-obsidian/90 mb-12">
            "Aftermath is not trend-driven fashion. It is clothing for stillness, reflection, and inner alignment."
          </p>
          <div className="w-px h-24 bg-obsidian/20 mx-auto"></div>
        </div>
      </section>

      {/* Love Notes / Testimonials */}
      <section className="bg-stone-100 border-t border-stone-200 relative">
          
          {/* DESKTOP VIEW: Split Screen (Sticky Left, Scroll Right) */}
          <div className="hidden md:flex">
              {/* Left Side - Sticky */}
              <div className="w-1/3 sticky top-0 h-screen flex flex-col justify-center px-16 border-r border-stone-200 bg-stone-100 z-10">
                  <h2 className="font-serif text-6xl text-obsidian mb-4">Love Notes</h2>
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-8 font-sans">from our customers</p>
                  <div className="w-12 h-0.5 bg-obsidian"></div>
              </div>

              {/* Right Side - Scrolling Content */}
              <div className="w-2/3 bg-stone-50">
                  {testimonials.map((item, idx) => (
                      <div key={idx} className="min-h-[50vh] flex flex-col justify-center px-24 py-20 border-b border-stone-200 last:border-0 reveal-on-scroll">
                          <p className="font-serif text-2xl leading-relaxed text-obsidian/80 mb-8 lowercase">
                              "{item.comment}"
                          </p>
                          <span className="text-xs font-sans uppercase tracking-widest text-stone-400">
                              {item.name}
                          </span>
                      </div>
                  ))}
              </div>
          </div>

          {/* MOBILE VIEW: Auto-Moving Carousel */}
          <div className="md:hidden py-20 overflow-hidden bg-stone-50">
              <div className="px-6 mb-12 text-center">
                  <h2 className="font-serif text-4xl text-obsidian mb-2">Love Notes</h2>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500">from our customers</p>
              </div>

              {/* Infinite Marquee Container */}
              <div className="relative w-full">
                  <div className="flex w-max animate-testimonial-marquee">
                      {/* Original Set */}
                      {testimonials.map((item, idx) => (
                          <div key={`orig-${idx}`} className="w-[85vw] flex-shrink-0 px-6 border-r border-stone-200/50 flex flex-col justify-center">
                              <p className="font-serif text-xl leading-relaxed text-obsidian/80 mb-6 lowercase">
                                  "{item.comment}"
                              </p>
                              <span className="text-[10px] font-sans uppercase tracking-widest text-stone-400">
                                  {item.name}
                              </span>
                          </div>
                      ))}
                      {/* Duplicate Set for seamless loop */}
                      {testimonials.map((item, idx) => (
                          <div key={`dup-${idx}`} className="w-[85vw] flex-shrink-0 px-6 border-r border-stone-200/50 flex flex-col justify-center">
                              <p className="font-serif text-xl leading-relaxed text-obsidian/80 mb-6 lowercase">
                                  "{item.comment}"
                              </p>
                              <span className="text-[10px] font-sans uppercase tracking-widest text-stone-400">
                                  {item.name}
                              </span>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </section>

      {/* Styles for new marquee */}
      <style>{`
          .animate-testimonial-marquee {
              animation: testimonialMarquee 40s linear infinite;
          }
          @keyframes testimonialMarquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
          }
      `}</style>
    </div>
  );
};

export default Home;