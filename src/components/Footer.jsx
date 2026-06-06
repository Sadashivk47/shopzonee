import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full bg-black text-white pt-20 pb-12 px-6 sm:px-12 font-sans border-t border-zinc-900 select-none">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Columns Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-16 justify-between items-start">
          
          {/* Col 1: Pastel Custom Brand Logo */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {/* Overlocking colored pastel dot grid logo precisely matching standard high-end corporate identity */}
              <div className="grid grid-cols-2 gap-1 w-7 h-7 shrink-0">
                <span className="w-3 h-3 rounded-full bg-zinc-700 opacity-90 blur-[0.3px]" />
                <span className="w-3 h-3 rounded-full bg-[#D4FC79] opacity-90 blur-[0.3px]" />
                <span className="w-3 h-3 rounded-full bg-cyan-400 opacity-90 blur-[0.3px]" />
                <span className="w-3 h-3 rounded-full bg-rose-400 opacity-90 blur-[0.3px]" />
              </div>
              <span className="font-display font-extrabold tracking-tight text-white text-base">
                ShopZone
              </span>
            </div>
            <p className="text-zinc-500 text-xs leading-relaxed max-w-xs">
              Premium curated essentials. Engineered for maximum simplicity and aesthetic performance.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-zinc-400 font-semibold text-xs uppercase tracking-widest">Links</h4>
            <ul className="space-y-3 text-xs text-zinc-500 font-medium">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home Catalog
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">
                  Collections & Shop
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact details */}
          <div className="space-y-4">
            <h4 className="text-zinc-400 font-semibold text-xs uppercase tracking-widest">Contact</h4>
            <ul className="space-y-3 text-xs text-zinc-500 font-medium">
              <li className="hover:text-white transition-colors">
                +1 (800) 130-9428
              </li>
              <li>
                <a href="mailto:info@shopzone.com" className="hover:text-white transition-colors">
                  support@shopzone.team
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">
                  LinkedIn Profile
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">
                  Twitter Enterprise
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Huge Typographic Wordmark Section spanning entire background screen */}
        <div className="py-8 select-none border-t border-zinc-900/60 text-center">
          <h1 className="text-[12vw] sm:text-[14vw] font-display font-extrabold text-white tracking-tighter leading-none uppercase selection:bg-slate-800">
            ShopZone
          </h1>
        </div>

        {/* Bottom Fine Print & Regulatory Notes */}
        <div className="border-t border-zinc-900 pt-8 flex flex-col items-center gap-4 text-center text-[10px] text-zinc-600 font-medium leading-relaxed max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mb-2">
            <span className="text-zinc-400 font-bold tracking-widest uppercase text-[11px]">
              SHOPZONE INC
            </span>
            <span className="hidden sm:inline text-zinc-800">|</span>
            <span className="text-zinc-500 tracking-widest text-[11px] uppercase">
              DESIGNED AND DEVELOPED BY{" "}
              <a 
                href="https://github.com/Sadashivk47" 
                target="_blank" 
                rel="noreferrer"
                className="text-[#D4FC79] hover:text-[#cbf768] hover:underline transition-all font-bold"
              >
                SADASHIV
              </a>
            </span>
          </div>
          <p>
            ShopZone™ and ShopZone Premium curated portfolios are registered trading brands of ShopZone Enterprises Ltd. Authorized and regulated by the leading global standard authorities under corporate registry number SF853018. You can inspect our security guidelines, real-time catalog compliance registers, and transactional safety details online at any time.
          </p>
          <p>
            Registered Office Location: 4th Floor Clyde Residences, 218 West George Street, Milan, G2 1BP. © 2026 ShopZone Group. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
