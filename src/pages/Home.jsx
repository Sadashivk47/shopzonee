import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Star, ArrowRight, Activity, Cpu, Sparkles, Lightbulb } from 'lucide-react';
import { customProducts, enhanceProduct } from '../data/customProducts';

// Editorial product tags generator representing the premium custom apothecary look
const getAestheticTag = (category, title) => {
  const cat = (category || '').toLowerCase();
  const t = (title || '').toLowerCase();
  if (cat.includes('beauty') || cat.includes('skin') || cat.includes('fragrance')) return 'ILLUMINATE';
  if (cat.includes('furniture') || cat.includes('home')) return 'DESIGN COHESION';
  if (cat.includes('electric') || cat.includes('laptop') || cat.includes('phone') || cat.includes('watch')) return 'INTELLIGENT';
  if (t.includes('honey') || t.includes('food') || t.includes('grocer')) return 'PURE NURTURE';
  return 'CORE SYSTEM';
};

export const Home = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // Fetch some high-quality items for Featured showcase from dummyjson
    fetch('https://dummyjson.com/products?limit=8')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load popular catalog.');
        return res.json();
      })
      .then((data) => {
        // Find or map products for homepage preview with realistic INR prices scale
        const scaled = data.products.map(p => ({
          ...p,
          price: Math.round(p.price * 85)
        }));
        // Prepend our beautiful professional model beauty care products at the absolute front
        setPopularProducts([...customProducts, ...scaled].map(enhanceProduct));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleScroll = (e) => {
    const container = e.currentTarget;
    const totalWidth = container.scrollWidth - container.clientWidth;
    if (totalWidth > 0) {
      const progress = (container.scrollLeft / totalWidth) * 100;
      setScrollProgress(progress);
    }
  };

  const handleCategoryClick = (categoryName) => {
    // Navigate with query param
    navigate(`/shop?category=${categoryName}`);
  };

  return (
    <div className="bg-slate-50/50 min-h-screen">
      {/* SECTION 1: Minimalist Split-Screen Luxury Hero Section */}
      <section className="relative min-h-[660px] md:h-[720px] grid grid-cols-1 md:grid-cols-2 border-b border-slate-200 overflow-hidden bg-slate-950">
        
        {/* Left Column: Text Content + High-Contrast High-Res Image Backdrop */}
        <div className="relative flex flex-col justify-center items-start px-8 sm:px-16 lg:px-20 py-24 md:py-0 overflow-hidden">
          {/* Background image under split-screen left panel */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.pexels.com/photos/14361606/pexels-photo-14361606.jpeg" 
              alt="Ethical Beauty Campaign" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Transparent/very light overlay to protect original brightness and color fully */}
            <div className="absolute inset-0 bg-black/15" />
          </div>

          <div className="relative z-10 max-w-xl text-left select-none">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/30 text-[#D4FC79] font-bold text-[10px] uppercase tracking-widest mb-8 border border-white/10 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4FC79] animate-pulse"></span>
              Now Live Globally
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-[4.2rem] font-display font-light tracking-tight text-white leading-[1.1] mb-6 max-w-md drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)] lowercase">
              curated <br />
              essentials.
            </h1>
            
            <p className="text-[12px] sm:text-[13px] text-slate-200/95 mb-10 max-w-xs leading-relaxed select-none drop-shadow-[0_1px_4px_rgba(0,0,0,0.35)] font-light tracking-wider lowercase">
              performance models designed for daily life. start with what you need, explore as you grow.
            </p>
            
            <div className="flex justify-start">
              <Link
                to="/shop"
                className="bg-[#D4FC79] text-slate-950 font-sans text-xs uppercase tracking-widest font-extrabold px-10 py-5 rounded-full shadow-lg shadow-black/15 hover:bg-white hover:text-slate-950 hover:scale-102 hover:-translate-y-0.5 transition-all duration-300 active:translate-y-0 active:scale-100"
              >
                Explore the Platform
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Media (Self-Hosted looping video) */}
        <div className="relative h-[360px] md:h-auto overflow-hidden bg-slate-900 flex justify-center items-center">
          <video 
            src="https://www.pexels.com/download/video/7440321/"
            loop 
            muted 
            autoPlay 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* No darkening or gradients on the primary media to preserve original quality */}
          
          <div className="absolute bottom-6 right-6 z-10 bg-black/40 px-3.5 py-1.5 rounded-full border border-white/10 backdrop-blur-md select-none pointer-events-none">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#D4FC79]/90 font-medium animate-pulse">
              Aesthetic Luxury Model • Active Splash
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 2: Horizontal Scrollable Best Products (Directly Below Hero Section) */}
      <section className="bg-[#FAF8F5] py-20 border-b border-slate-205/65 w-full">
        <div className="w-full font-sans">
          
          {/* Header Title with Editorial dot identifier */}
          <div className="flex items-center gap-3 mb-12 select-none justify-start px-6 md:px-12">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse"></span>
            <h2 className="text-xl font-bold text-slate-950 tracking-tight lowercase">best sellers</h2>
            <span className="text-xl text-slate-400 font-light lowercase">sets</span>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-950"></div>
            </div>
          ) : error ? (
            <div className="text-center text-slate-400 py-10 bg-[#FAF7F2] rounded-xl border border-dashed border-slate-200 mx-6">
              <p>Failed to load promotional showcases.</p>
            </div>
          ) : (
            <div className="relative group w-full">
              {/* Horizontal Scroll container with scroll tracking - absolute zero edge-gaps */}
              <div 
                onScroll={handleScroll}
                className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scroll-smooth scrollbar-none w-full px-0"
              >
                {/* Invisible spacers at start and end to enable clean alignment, or simple direct touch */}
                <div className="w-6 md:w-12 flex-shrink-0" />
                
                {popularProducts.map((product) => {
                  const tag = getAestheticTag(product.category, product.title);
                  return (
                    <div
                      key={product.id}
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="flex-shrink-0 w-[240px] sm:w-[280px] md:w-[320px] snap-start flex flex-col justify-between group cursor-pointer"
                    >
                      {/* Cozy natural beige product box background */}
                      <div className="bg-[#F1EFEA] border border-slate-100 aspect-[3/4] rounded-sm overflow-hidden relative mb-4 flex justify-center items-center">
                        <img
                          alt={product.title}
                          className="w-full h-full object-contain p-6 mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
                          src={product.thumbnail || product.images[0]}
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="space-y-1 text-left select-none pr-4">
                        <span className="block font-mono text-[9px] uppercase tracking-widest text-[#a2a09a] font-extrabold">
                          {tag}
                        </span>
                        <h3 className="font-sans text-[12px] text-slate-800 font-bold tracking-tight group-hover:text-slate-950 transition-colors uppercase truncate">
                          {product.title}
                        </h3>
                        <span className="block font-mono text-[11.5px] text-slate-500 font-bold">
                          ₹{product.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
                
                <div className="w-6 md:w-12 flex-shrink-0" />
              </div>

              {/* Progress scrollbar slider exactly matching reference design, indent aligned with titles */}
              <div className="w-36 sm:w-56 h-[2px] bg-slate-200 mt-8 relative rounded-full overflow-hidden mx-6 md:mx-12">
                <div 
                  className="absolute left-0 top-0 h-full bg-slate-950 transition-all duration-75"
                  style={{ width: `${scrollProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3: Editorial Vertical Split Category Section (Under Best Sellers) */}
      <section className="w-full border-b border-slate-200 bg-slate-950 font-sans">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0">
          
          {/* Category - Electronics */}
          <div
            onClick={() => handleCategoryClick('electronics')}
            className="group relative cursor-pointer overflow-hidden border-r border-b lg:border-b-0 border-white/10 h-[480px] sm:h-[600px] md:h-[660px] bg-slate-900 transition-all duration-500"
          >
            <video
              src="https://www.pexels.com/download/video/6624858/"
              className="absolute inset-x-0 inset-y-0 w-full h-full object-cover opacity-100 group-hover:scale-105 transition-transform duration-700"
              loop
              muted
              autoPlay
              playsInline
            />
            {/* Extremely subtle protective shadow overlay to assist white copy readability without darkening */}
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-500 pointer-events-none" />
            
            {/* Vertical title container */}
            <div className="absolute top-10 left-6 sm:left-10 z-10 flex flex-col justify-start items-start select-none">
              <h3 
                style={{ writingMode: 'vertical-lr' }}
                className="font-display text-4xl sm:text-[3.2rem] font-light text-white tracking-widest lowercase select-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] rotate-180"
              >
                electronics
              </h3>
            </div>

            {/* Pill CTA Button */}
            <div className="absolute bottom-8 left-6 sm:left-10 z-10">
              <button className="bg-white hover:bg-[#D4FC79] text-slate-950 font-sans text-[10px] uppercase tracking-widest font-extrabold px-6 py-3 rounded-full shadow-md transition-colors duration-300 pointer-events-none lowercase">
                shop electronics
              </button>
            </div>
          </div>

          {/* Category - Skincare */}
          <div
            onClick={() => handleCategoryClick('skincare')}
            className="group relative cursor-pointer overflow-hidden border-r border-b lg:border-b-0 border-white/10 h-[480px] sm:h-[600px] md:h-[660px] bg-slate-900 transition-all duration-500"
          >
            <video
              src="https://www.pexels.com/download/video/6446058/"
              className="absolute inset-x-0 inset-y-0 w-full h-full object-cover opacity-100 group-hover:scale-105 transition-transform duration-700"
              loop
              muted
              autoPlay
              playsInline
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-500 pointer-events-none" />
            
            {/* Vertical title container */}
            <div className="absolute top-10 left-6 sm:left-10 z-10 flex flex-col justify-start items-start select-none">
              <h3 
                style={{ writingMode: 'vertical-lr' }}
                className="font-display text-4xl sm:text-[3.2rem] font-light text-white tracking-widest lowercase select-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] rotate-180"
              >
                skincare
              </h3>
            </div>

            {/* Pill CTA Button */}
            <div className="absolute bottom-8 left-6 sm:left-10 z-10">
              <button className="bg-white hover:bg-[#D4FC79] text-slate-950 font-sans text-[10px] uppercase tracking-widest font-extrabold px-6 py-3 rounded-full shadow-md transition-colors duration-300 pointer-events-none lowercase">
                shop skincare
              </button>
            </div>
          </div>

          {/* Category - Body */}
          <div
            onClick={() => handleCategoryClick('body')}
            className="group relative cursor-pointer overflow-hidden border-r border-b sm:border-b-0 border-white/10 h-[480px] sm:h-[600px] md:h-[660px] bg-slate-900 transition-all duration-500"
          >
            <video
              src="https://www.pexels.com/download/video/8116707/"
              className="absolute inset-x-0 inset-y-0 w-full h-full object-cover opacity-100 group-hover:scale-105 transition-transform duration-700"
              loop
              muted
              autoPlay
              playsInline
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-500 pointer-events-none" />
            
            {/* Vertical title container */}
            <div className="absolute top-10 left-6 sm:left-10 z-10 flex flex-col justify-start items-start select-none">
              <h3 
                style={{ writingMode: 'vertical-lr' }}
                className="font-display text-4xl sm:text-[3.2rem] font-light text-white tracking-widest lowercase select-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] rotate-180"
              >
                body
              </h3>
            </div>

            {/* Pill CTA Button */}
            <div className="absolute bottom-8 left-6 sm:left-10 z-10">
              <button className="bg-white hover:bg-[#D4FC79] text-slate-950 font-sans text-[10px] uppercase tracking-widest font-extrabold px-6 py-3 rounded-full shadow-md transition-colors duration-300 pointer-events-none lowercase">
                shop body
              </button>
            </div>
          </div>

          {/* Category - Furniture */}
          <div
            onClick={() => handleCategoryClick('furniture')}
            className="group relative cursor-pointer overflow-hidden h-[480px] sm:h-[600px] md:h-[660px] bg-slate-900 transition-all duration-500"
          >
            <video
              src="https://www.pexels.com/download/video/7239163/"
              className="absolute inset-x-0 inset-y-0 w-full h-full object-cover opacity-100 group-hover:scale-105 transition-transform duration-700"
              loop
              muted
              autoPlay
              playsInline
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-500 pointer-events-none" />
            
            {/* Vertical title container */}
            <div className="absolute top-10 left-6 sm:left-10 z-10 flex flex-col justify-start items-start select-none">
              <h3 
                style={{ writingMode: 'vertical-lr' }}
                className="font-display text-4xl sm:text-[3.2rem] font-light text-white tracking-widest lowercase select-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] rotate-180"
              >
                furniture
              </h3>
            </div>

            {/* Pill CTA Button */}
            <div className="absolute bottom-8 left-6 sm:left-10 z-10">
              <button className="bg-white hover:bg-[#D4FC79] text-slate-950 font-sans text-[10px] uppercase tracking-widest font-extrabold px-6 py-3 rounded-full shadow-md transition-colors duration-300 pointer-events-none lowercase">
                shop furniture
              </button>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;
