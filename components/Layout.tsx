import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '../StoreContext';
import { Menu, ShoppingBag, X, User, Search, Mail, MessageCircle, Instagram } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LiquidButton from './LiquidButton';
import Toast from './Toast';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { cart, toggleCart, isCartOpen, removeFromCart, products } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Close mobile menu and search on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setSearchQuery('');
  }, [location]);

  // Handle Scroll for Header Styling
  useEffect(() => {
    const handleScroll = () => {
        setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
        searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const searchResults = searchQuery.length > 0 
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5) 
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Dynamic Header Styles
  const isTransparent = isHomePage && !isScrolled;
  
  const headerClasses = `fixed top-0 z-50 w-full transition-all duration-500 ease-in-out ${
      isTransparent ? 'bg-transparent shadow-none' : 'bg-stone-200 shadow-md'
  }`;

  const textColorClass = isTransparent ? 'text-stone-100' : 'text-obsidian';
  const iconColorClass = isTransparent ? 'text-stone-100' : 'text-obsidian';
  
  // Intense shadow for text visibility on Hero
  const textShadowStyle = isTransparent 
      ? { textShadow: '0 2px 12px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.5)' } 
      : {};

  // Invert logo on transparent header (assuming logo is dark by default)
  const logoClass = `h-8 md:h-12 w-auto object-contain transition-all duration-500 ${
      isTransparent ? 'invert drop-shadow-lg' : ''
  }`;

  const paymentMethods = [
    { name: 'Visa', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png' },
    { name: 'Mastercard', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png' },
    { name: 'Easypaisa', src: 'https://pbs.twimg.com/profile_images/1595402304240472064/YQPoq-Sr_400x400.jpg' },
    { name: 'JazzCash', src: 'https://play-lh.googleusercontent.com/uG93WUUyYVhe-B-5hBqKhr1X--UvgiICOFgD9rK4dbYG3TdqXKjq_TsJU7Pg034dOA=w240-h480-rw' },
    { name: 'Bank Alfalah', src: 'https://play-lh.googleusercontent.com/xAcsQph2V8-o0te7Vvmu-zKTqU0N677r_USEWsMIneEml_mZBz0R6m4lCUiIfoNwHA' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-stone-200 text-obsidian">
      <Toast />
      {/* Unified Fixed Header */}
      <header className={headerClasses}>
        
        {/* Navigation */}
        <nav className={`border-b transition-colors duration-500 relative ${isTransparent ? 'border-transparent' : 'border-obsidian/5'}`}>
            <div className="max-w-7xl mx-auto px-6 h-14 md:h-16 flex items-center justify-between">
            
            {/* Mobile: Menu Trigger (Left) */}
            <div className="flex md:hidden items-center">
                <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                    className={`p-2 -ml-2 hover:opacity-70 transition-opacity btn-glass-icon ${iconColorClass}`} 
                    aria-label="Menu"
                >
                    <Menu className="w-5 h-5 stroke-1" style={textShadowStyle} />
                </button>
            </div>

            {/* Logo (Centered on Mobile, Left on Desktop) */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:static md:translate-x-0 md:translate-y-0 md:left-auto md:top-auto z-10">
                <Link to="/" className={`block transition-opacity ${isSearchOpen ? 'opacity-0 md:opacity-100' : 'opacity-100'}`}>
                    <img 
                        src="https://res.cloudinary.com/dacyy7rkn/image/upload/h_100,c_scale/v1766520199/aftermath_logo_1_-02_phtpip.webp" 
                        alt="Aftermath" 
                        className={logoClass}
                        width="150"
                        height="48"
                    />
                </Link>
            </div>

            {/* Desktop Links (Centered) */}
            <div className={`hidden md:flex gap-8 text-xs tracking-[0.15em] uppercase opacity-90 absolute left-1/2 -translate-x-1/2 ${textColorClass}`} style={textShadowStyle}>
                <Link to="/collection" className="hover:opacity-100 transition-opacity hover:underline underline-offset-4 decoration-1">Collection</Link>
                <Link to="/#philosophy" className="hover:opacity-100 transition-opacity hover:underline underline-offset-4 decoration-1">Philosophy</Link>
                <Link to="/contact" className="hover:opacity-100 transition-opacity hover:underline underline-offset-4 decoration-1">Contact</Link>
            </div>

            {/* Right Icons: Search & Cart */}
            <div className={`flex items-center gap-2 md:gap-4 z-20 ${iconColorClass}`}>
                
                {/* Search Component */}
                <div className="flex items-center">
                    {/* Desktop Expanded Input */}
                    <div className={`hidden md:flex items-center overflow-hidden transition-all duration-300 ease-out ${isSearchOpen ? 'w-64 opacity-100' : 'w-0 opacity-0'}`}>
                        <form onSubmit={handleSearchSubmit} className="w-full">
                            <input 
                                ref={searchInputRef}
                                type="text" 
                                placeholder="Search..." 
                                className={`w-full bg-transparent border-b py-1 text-sm focus:outline-none font-sans placeholder-current opacity-80 ${isTransparent ? 'border-white/50 text-white' : 'border-obsidian/20 text-obsidian'}`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onBlur={() => {
                                    setTimeout(() => {
                                        if(searchQuery.length === 0) setIsSearchOpen(false);
                                    }, 200);
                                }}
                            />
                        </form>
                        <button onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} className={`ml-2 hover:opacity-80 btn-glass-icon p-1 rounded-full ${isTransparent ? 'text-white' : 'text-stone-400'}`} aria-label="Close search">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Search Icon Trigger (Visible when closed or on mobile) */}
                    {(!isSearchOpen || window.innerWidth < 768) && (
                        <button 
                            onClick={() => setIsSearchOpen(true)} 
                            className={`p-2 btn-glass-icon rounded-full ${isSearchOpen && window.innerWidth >= 768 ? 'hidden' : 'block'}`}
                            aria-label="Search"
                        >
                            <Search className="w-5 h-5 stroke-1" style={textShadowStyle} />
                        </button>
                    )}

                    {/* Desktop Results Dropdown - Always use light bg for readability */}
                    {isSearchOpen && searchQuery.length > 0 && (
                        <div className="hidden md:block absolute top-full right-0 mt-2 w-80 bg-white shadow-2xl border border-stone-100 p-2 rounded-lg animate-fade-in backdrop-blur-md bg-white/95 text-obsidian">
                            {searchResults.length > 0 ? (
                                searchResults.map(product => (
                                    <Link 
                                        key={product.id} 
                                        to={`/product/${product.id}`}
                                        className="flex items-center gap-3 p-2 hover:bg-stone-50 transition-colors group rounded-md"
                                        onClick={() => setIsSearchOpen(false)}
                                    >
                                        <div className="w-10 h-12 bg-stone-200 overflow-hidden rounded-sm">
                                            <img src={product.images[0]} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" width="40" height="48" loading="lazy" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-medium font-serif">{product.name}</span>
                                            <span className="text-[10px] text-stone-500 uppercase tracking-wider">{product.category}</span>
                                        </div>
                                        <span className="ml-auto text-xs font-medium">PKR {product.price.toLocaleString()}</span>
                                    </Link>
                                ))
                            ) : (
                                <div className="p-4 text-center text-xs text-stone-400">No results found.</div>
                            )}
                        </div>
                    )}
                </div>

                <Link to="/admin" className="hidden md:block p-2 btn-glass-icon rounded-full" aria-label="Admin">
                    <User className="w-5 h-5 stroke-1" style={textShadowStyle} />
                </Link>

                <button onClick={toggleCart} className="relative group p-2 btn-glass-icon rounded-full" aria-label="Cart">
                    <ShoppingBag className="w-5 h-5 stroke-1" style={textShadowStyle} />
                    {cart.length > 0 && (
                        <span className={`absolute top-1 right-1 w-2 h-2 rounded-full ${isTransparent ? 'bg-white' : 'bg-obsidian'}`}></span>
                    )}
                </button>
            </div>
            </div>

            {/* Mobile Search Overlay */}
            {isSearchOpen && (
                <div className="md:hidden absolute inset-0 bg-stone-200 z-50 flex items-center px-6 animate-fade-in h-14 border-b border-obsidian/5 text-obsidian">
                    <Search className="w-4 h-4 stroke-1 opacity-40 mr-3" />
                    <input 
                        ref={searchInputRef}
                        type="text" 
                        placeholder="Search products..." 
                        className="flex-1 bg-transparent py-2 text-sm focus:outline-none font-sans text-obsidian placeholder-obsidian/40"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} aria-label="Close">
                        <X className="w-5 h-5 stroke-1 opacity-60" />
                    </button>

                    {/* Mobile Results Dropdown */}
                    {searchQuery.length > 0 && (
                        <div className="absolute top-full left-0 right-0 bg-white border-b border-stone-200 shadow-xl max-h-[60vh] overflow-y-auto">
                            {searchResults.length > 0 ? (
                                searchResults.map(product => (
                                    <Link 
                                        key={product.id} 
                                        to={`/product/${product.id}`}
                                        className="flex items-center gap-4 p-4 border-b border-stone-100 last:border-0 hover:bg-stone-50"
                                        onClick={() => setIsSearchOpen(false)}
                                    >
                                        <div className="w-12 h-16 bg-stone-200 overflow-hidden">
                                            <img src={product.images[0]} alt="" className="w-full h-full object-cover" width="48" height="64" loading="lazy" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-serif">{product.name}</p>
                                            <p className="text-xs text-stone-500">PKR {product.price.toLocaleString()}</p>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="p-6 text-center text-sm text-stone-400">No results found.</div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </nav>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
           <div className="fixed inset-0 top-[calc(2.5rem+3.5rem)] bg-stone-200 z-40 flex flex-col items-center justify-center space-y-8 animate-fade-in border-t border-obsidian/5 text-obsidian">
              <Link to="/collection" className="text-xl font-serif" onClick={() => setIsMobileMenuOpen(false)}>Collection</Link>
              <Link to="/#philosophy" className="text-xl font-serif" onClick={() => setIsMobileMenuOpen(false)}>Philosophy</Link>
              <Link to="/contact" className="text-xl font-serif" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
              <Link to="/admin" className="text-sm opacity-50 uppercase tracking-widest" onClick={() => setIsMobileMenuOpen(false)}>Admin Access</Link>
           </div>
        )}
      </header>

      {/* Main Content - Add padding top if not on home page to account for fixed header */}
      <main className={`flex-grow ${isHomePage ? '' : 'pt-24 md:pt-28'}`}>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-obsidian text-stone-300 py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-6">
                {/* Footer Logo: Resized via Cloudinary (height ~150px source for retina) */}
                <img 
                    src="https://res.cloudinary.com/dacyy7rkn/image/upload/h_150,c_scale/v1766520199/aftermath_logo_1_-02_phtpip.webp" 
                    alt="Aftermath" 
                    className="h-16 w-auto object-contain invert opacity-90"
                    width="200"
                    height="64"
                    loading="lazy"
                />
            </div>
            <p className="text-sm opacity-70 max-w-sm leading-relaxed">
              Clothing for stillness. Built for people who choose calm over noise.
              <br /><br />
              Lahore, Pakistan
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest mb-6 opacity-50">Support</h4>
            <ul className="space-y-4 text-sm opacity-80">
              <li><Link to="/shipping">Shipping Policy</Link></li>
              <li><Link to="/returns">Refund Policy</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest mb-6 opacity-50">Connect</h4>
            <div className="flex flex-col gap-4">
               {/* Instagram */}
               <a 
                 href="https://www.instagram.com/after.math_store/" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="flex items-center gap-3 group"
               >
                  <div className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 bg-white/5 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
                    <Instagram className="w-4 h-4 stroke-[1.5] text-stone-300" />
                  </div>
                  <span className="text-sm text-stone-400 group-hover:text-stone-200 transition-colors tracking-wide">Instagram</span>
               </a>

               {/* WhatsApp */}
               <a 
                 href="https://wa.me/923079909749" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="flex items-center gap-3 group"
               >
                  <div className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 bg-white/5 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
                    <MessageCircle className="w-4 h-4 stroke-[1.5] text-stone-300" />
                  </div>
                  <span className="text-sm text-stone-400 group-hover:text-stone-200 transition-colors tracking-wide">WhatsApp</span>
               </a>

               {/* Email */}
               <a 
                 href="mailto:aftermathstore@hotmail.com" 
                 className="flex items-center gap-3 group"
               >
                  <div className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 bg-white/5 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
                    <Mail className="w-4 h-4 stroke-[1.5] text-stone-300" />
                  </div>
                  <span className="text-sm text-stone-400 group-hover:text-stone-200 transition-colors tracking-wide">Email Us</span>
               </a>
            </div>
          </div>
        </div>

        {/* Payment Methods & Copyright Row */}
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-stone-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-xs opacity-40 order-2 md:order-1">&copy; {new Date().getFullYear()} Aftermath. Live within.</p>
            
            <div className="grid grid-cols-3 gap-3 md:flex md:flex-wrap md:items-center md:justify-end order-1 md:order-2">
               {/* COD Badge */}
               <div className="h-8 w-12 px-2 bg-white rounded flex items-center justify-center shadow-sm">
                   <span className="text-[9px] font-bold text-emerald-800 leading-none text-center">CASH ON<br/>DELIVERY</span>
               </div>
               
               {/* Payment Icons */}
               {paymentMethods.map((pm) => (
                   <div key={pm.name} className="h-8 w-12 bg-white rounded flex items-center justify-center p-1 shadow-sm overflow-hidden">
                       <img 
                         src={pm.src} 
                         alt={pm.name} 
                         className="w-full h-full object-contain"
                         width="48"
                         height="32"
                         loading="lazy"
                         onError={(e) => {
                           // Text fallback if image fails
                           const img = e.target as HTMLImageElement;
                           const parent = img.parentElement;
                           if (parent) {
                               img.style.display = 'none';
                               parent.innerText = pm.name;
                               parent.classList.add('text-[7px]', 'font-bold', 'text-obsidian', 'text-center', 'break-words', 'px-1');
                           }
                         }}
                       />
                   </div>
               ))}
            </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      {isCartOpen && (
        <>
          <div className="fixed inset-0 bg-obsidian/20 backdrop-blur-sm z-[60] transition-opacity" onClick={toggleCart}></div>
          <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-stone-100/90 backdrop-blur-xl shadow-2xl z-[60] transform transition-transform duration-300 ease-out flex flex-col border-l border-white/20 text-obsidian">
            <div className="p-6 flex items-center justify-between border-b border-stone-200/50">
              <h2 className="font-serif text-xl">Your Selection</h2>
              <button onClick={toggleCart}><X className="w-6 h-6 stroke-1 opacity-50 hover:opacity-100" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-40">
                  <p className="font-serif text-lg">Empty.</p>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={`${item.id}-${item.selectedSize}-${idx}`} className="flex gap-4">
                    <img src={item.images[0]} alt={item.name} className="w-20 h-24 object-cover grayscale rounded-md" width="80" height="96" loading="lazy" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium text-sm">{item.name}</h3>
                        <p className="text-sm">PKR {item.price.toLocaleString()}</p>
                      </div>
                      <p className="text-xs text-stone-500 mb-4">Size: {item.selectedSize}</p>
                      <button 
                        onClick={() => removeFromCart(item.id, item.selectedSize)}
                        className="text-xs text-stone-400 hover:text-red-900 border-b border-transparent hover:border-red-900 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-stone-200/50 bg-stone-50/50">
                <div className="flex justify-between items-end mb-6">
                  <span className="text-xs uppercase tracking-widest opacity-60">Subtotal</span>
                  <span className="font-serif text-xl">PKR {cartTotal.toLocaleString()}</span>
                </div>
                <LiquidButton 
                  onClick={() => { toggleCart(); navigate('/checkout'); }}
                  variant="solid"
                  className="w-full py-4 text-xs uppercase tracking-widest"
                  fullWidth
                >
                  Proceed to Checkout
                </LiquidButton>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Layout;