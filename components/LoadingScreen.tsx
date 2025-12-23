import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    // Show the intro for 2.2 seconds, then start exit animation
    const timer = setTimeout(() => {
      setHide(true);
      
      // Wait for the CSS transition (1.0s) to finish completely (plus buffer) before unmounting
      // This prevents the component from being removed while still visible/animating
      setTimeout(() => {
        onComplete();
      }, 1500); 
    }, 2200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-obsidian text-stone-100 transition-transform duration-1000 cubic-bezier(0.76, 0, 0.24, 1) ${
        hide ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="text-center p-8 flex flex-col items-center">
        <p className="text-xs md:text-sm font-sans uppercase tracking-[0.4em] text-stone-400 mb-6 animate-fade-in opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          Presenting
        </p>
        <img 
            src="https://res.cloudinary.com/dacyy7rkn/image/upload/v1766520199/aftermath_logo_1_-02_phtpip.webp"
            alt="Aftermath"
            className="h-24 md:h-40 w-auto object-contain invert animate-fade-in-up opacity-0"
            style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
        />
        {/* Subtle loading bar */}
        <div className="w-24 h-[1px] bg-stone-800 mx-auto mt-12 overflow-hidden relative">
            <div className="absolute inset-y-0 left-0 bg-stone-400 w-full animate-[loading_2s_ease-in-out_infinite] origin-left" />
        </div>
      </div>
      
      <style>{`
        @keyframes loading {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(0%); }
            100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;