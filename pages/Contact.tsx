import React from 'react';
import { Mail, MessageCircle } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-24 animate-fade-in">
      <div className="max-w-2xl w-full text-center space-y-12">
        <div>
            <h1 className="text-5xl md:text-7xl font-serif italic mb-6">Get in Touch</h1>
            <p className="text-stone-500 text-sm md:text-base tracking-wide leading-relaxed">
                We are here to assist with your order, sizing inquiries, or simply to share our philosophy.
            </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-6 w-full max-w-lg mx-auto">
            <a 
                href="https://wa.me/923079909749" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-glass group flex flex-col items-center justify-center p-4 md:p-8 rounded-2xl gap-3 md:gap-4 hover:scale-[1.02] transition-transform"
            >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-obsidian/5 flex items-center justify-center group-hover:bg-obsidian/10 transition-colors">
                    <MessageCircle className="w-5 h-5 md:w-6 md:h-6 stroke-[1.5]" />
                </div>
                <div className="space-y-1 w-full overflow-hidden">
                    <span className="block text-[10px] md:text-xs uppercase tracking-widest font-bold">WhatsApp</span>
                    <span className="block text-[10px] md:text-xs text-stone-500 truncate w-full text-center">+92 307 9909749</span>
                </div>
            </a>

            <a 
                href="mailto:aftermathstore@hotmail.com"
                className="btn-glass group flex flex-col items-center justify-center p-4 md:p-8 rounded-2xl gap-3 md:gap-4 hover:scale-[1.02] transition-transform"
            >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-obsidian/5 flex items-center justify-center group-hover:bg-obsidian/10 transition-colors">
                    <Mail className="w-5 h-5 md:w-6 md:h-6 stroke-[1.5]" />
                </div>
                <div className="space-y-1 w-full overflow-hidden">
                    <span className="block text-[10px] md:text-xs uppercase tracking-widest font-bold">Email</span>
                    <span className="block text-[10px] md:text-xs text-stone-500 truncate w-full text-center">aftermathstore@hotmail.com</span>
                </div>
            </a>
        </div>
        
        <div className="pt-12 border-t border-obsidian/5">
             <p className="text-xs uppercase tracking-widest opacity-40">Lahore, Pakistan</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;