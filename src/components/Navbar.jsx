import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Menu, X, User, LogOut, ArrowRight } from 'lucide-react';

export const Navbar = () => {
  const { totalItems, isLoggedIn, logout, currentUser } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleToggle = () => setIsOpen(!isOpen);
  const handleClose = () => setIsOpen(false);

  const isActive = (path) => location.pathname === path;

  const isHome = location.pathname === '/';

  return (
    <div className={`${isHome ? 'absolute' : 'sticky'} top-0 left-0 w-full z-50 flex flex-col pointer-events-none`}>
      {/* Premium Announcement Bar */}
      <div className="pointer-events-auto bg-slate-950 text-white text-[11px] font-medium py-2.5 px-6 flex items-center justify-center text-center tracking-wide font-sans select-none border-b border-white/[0.08] relative z-55">
        <span className="opacity-90">See how ShopZone is redefining premium curated essentials globally</span>
        <Link to="/shop" className="ml-2.5 text-[#D4FC79] font-medium hover:underline flex items-center gap-1">
          Explore Platform <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Floating Modern Header */}
      <header className="pointer-events-auto w-full bg-transparent py-4 px-6 transition-all duration-300 select-none">
        <div className="max-w-7xl mx-auto flex justify-between items-center h-16">
          
          {/* Logo Brand Symbol (Far Left) */}
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger menu */}
            <button
              onClick={handleToggle}
              className="p-2 bg-black hover:bg-slate-900 rounded-full transition-colors md:hidden text-white"
              aria-label="Toggle menu"
            >
              <Menu className="w-4 h-4" />
            </button>
            <Link to="/" className="flex items-center gap-3 focus:outline-none select-none group">
              {/* Overlocking colored pastel dot grid logo exactly matching premium high-end corporate identity */}
              <div className="grid grid-cols-2 gap-1 w-6.5 h-6.5 shrink-0 transition-transform duration-300 group-hover:rotate-12">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-950 blur-[0.3px]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#D4FC79] blur-[0.3px]" />
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 blur-[0.3px]" />
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400 blur-[0.3px]" />
              </div>
            </Link>
          </div>

          {/* Center Capsule: Solid black rounded-full pill (Hidden on Mobile) */}
          <div className="hidden md:flex items-center bg-black text-white px-7 py-2.5 rounded-full border border-white/10 gap-8 h-12 shadow-xl backdrop-blur-md">
            <Link to="/" className="font-display font-extrabold text-white tracking-tight text-base hover:opacity-95 mr-2">
              ShopZone
            </Link>
            <div className="flex items-center space-x-7">
              <Link
                to="/"
                className={`text-[11px] font-bold tracking-widest uppercase transition-colors ${
                  isActive('/') ? 'text-[#D4FC79]' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Home
              </Link>
              <Link
                to="/shop"
                className={`text-[11px] font-bold tracking-widest uppercase transition-colors ${
                  isActive('/shop') ? 'text-[#D4FC79]' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Shop
              </Link>
              <Link
                to="/contact"
                className={`text-[11px] font-bold tracking-widest uppercase transition-colors ${
                  isActive('/contact') ? 'text-[#D4FC79]' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Right Capsule: Solid black login / support & Cart details (Hidden on Mobile) */}
          <div className="hidden md:flex items-center bg-black text-white px-5 py-2.5 rounded-full border border-white/10 gap-4.5 h-12 shadow-xl backdrop-blur-md">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <span className="text-[11.5px] font-bold text-[#D4FC79] tracking-wider uppercase truncate max-w-[80px]">
                  {currentUser?.name?.split(' ')[0] || 'User'}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-zinc-400 hover:text-rose-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-[11px] font-bold tracking-widest uppercase text-zinc-300 hover:text-white transition-colors"
              >
                Login
              </Link>
            )}

            <div className="h-4.5 w-[1px] bg-zinc-800" />

            <Link
              to="/cart"
              className="relative flex items-center text-zinc-300 hover:text-white transition-colors group"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-105" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#D4FC79] text-black text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center border border-black shadow-xs">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile view side capsule */}
          <div className="flex md:hidden items-center bg-black text-white px-4 py-2 rounded-full border border-white/15 gap-4 h-10 shadow-lg">
            {!isLoggedIn && (
              <Link
                to="/login"
                className="text-[10px] font-bold tracking-widest uppercase text-zinc-300 hover:text-white"
              >
                Login
              </Link>
            )}
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="text-zinc-400 hover:text-rose-400"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
            <div className="h-4 w-[1px] bg-zinc-800" />
            <Link
              to="/cart"
              className="relative flex items-center text-zinc-300"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#D4FC79] text-black text-[7.5px] font-bold w-3 h-3 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

        </div>
      </header>

      {/* Navigation Drawer for Mobile */}
      <div
        className={`fixed inset-0 z-50 pointer-events-none transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto bg-slate-950/20 backdrop-blur-xs' : 'opacity-0'
        }`}
        onClick={handleClose}
      >
        <aside
          className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-slate-150/40 shadow-2xl transition-transform duration-300 ease-in-out pointer-events-auto flex flex-col py-6 ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 mb-8 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="grid grid-cols-2 gap-1 w-6 h-6 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-950 blur-[0.2px]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#D4FC79] blur-[0.2px]" />
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 blur-[0.2px]" />
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400 blur-[0.2px]" />
              </div>
              <span className="font-display font-black tracking-tight text-xl text-slate-950">
                ShopZone
              </span>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 hover:bg-slate-50 rounded-full text-slate-500"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex flex-col space-y-1 px-4 font-sans">
            <Link
              to="/"
              onClick={handleClose}
              className={`flex items-center gap-3 py-3 px-4 rounded-xl text-xs uppercase tracking-widest font-bold transition-all ${
                isActive('/')
                  ? 'bg-slate-950 text-white font-black'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/shop"
              onClick={handleClose}
              className={`flex items-center gap-3 py-3 px-4 rounded-xl text-xs uppercase tracking-widest font-bold transition-all ${
                isActive('/shop')
                  ? 'bg-slate-950 text-white font-black'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Shop
            </Link>
            <Link
              to="/contact"
              onClick={handleClose}
              className={`flex items-center gap-3 py-3 px-4 rounded-xl text-xs uppercase tracking-widest font-bold transition-all ${
                isActive('/contact')
                  ? 'bg-slate-950 text-white font-black'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Contact
            </Link>
          </nav>

          <div className="mt-auto px-6 pt-6 border-t border-slate-100 space-y-3">
            {isLoggedIn ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-slate-950 text-white flex items-center justify-center text-sm font-black uppercase shrink-0">
                    {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate leading-tight">
                      {currentUser?.name || 'Guest User'}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                      {currentUser?.email || 'guest@shopzone.com'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    handleClose();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs uppercase tracking-wider transition-all"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={handleClose}
                  className="w-full flex items-center justify-center py-3 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs uppercase tracking-wider transition-all border border-slate-200"
                >
                  Log In
                </Link>
                <Link
                  to="/shop"
                  onClick={handleClose}
                  className="w-full flex items-center justify-center py-3 px-4 rounded-xl bg-slate-950 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:bg-slate-900"
                >
                  Explore Collections
                </Link>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Navbar;
