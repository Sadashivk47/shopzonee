import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem } from '../components/CartItem';
import { ShoppingBag, ArrowRight, Ticket } from 'lucide-react';

export const Cart = () => {
  const { cartItems, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();
  
  // Custom mock discount code logic
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCode, setAppliedCode] = useState('');
  const [promoError, setPromoError] = useState('');

  const handleApplyPromo = () => {
    setPromoError('');
    if (!promoCode) return;
    
    const code = promoCode.toUpperCase().trim();
    if (code === 'DISCOUNT10' || code === 'SHOP50' || code === 'WELCOME2026') {
      const rate = code === 'SHOP50' ? 0.5 : code === 'WELCOME2026' ? 0.2 : 0.1;
      const amt = parseFloat((totalPrice * rate).toFixed(2));
      setDiscountAmount(amt);
      setAppliedCode(code);
      setPromoCode('');
    } else {
      setPromoError('Invalid coupon code. Try entering "DISCOUNT10" or "SHOP50"');
    }
  };

  const handleRemovePromo = () => {
    setDiscountAmount(0);
    setAppliedCode('');
  };

  // Calculations
  const shippingCharge = 0; // Free
  const gstRate = 0.18; // 18% GST as per template mock-up
  const computedGst = parseFloat((totalPrice * gstRate).toFixed(2));
  const finalEstimatedTotal = parseFloat(
    (totalPrice + shippingCharge + computedGst - discountAmount).toFixed(2)
  );

  const handleCheckoutNavigation = () => {
    // Navigate dynamically to checkout page
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-slate-50/50 min-h-screen pt-24 pb-32 flex flex-col justify-center items-center px-6 font-sans">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-800 animate-pulse">
          <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Your Shopping Bag is empty</h2>
        <p className="font-medium text-sm text-slate-400 mt-1 max-w-sm text-center leading-relaxed mb-8">
          Looks like you haven't added anything to your cart yet. Head back to the store catalog to discover our latest collections.
        </p>
        <Link
          to="/shop"
          className="bg-slate-950 text-[#D4FC79] px-8 py-4 rounded-xl font-bold text-sm hover:bg-slate-900 transition-all shadow-md hover:-translate-y-0.5"
        >
          Start Browsing
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 min-h-screen pt-24 pb-32">
      <main className="max-w-7xl mx-auto px-6 font-sans">
        
        {/* Page Titles Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Shopping Bag
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Review items and complete your order.
            </p>
          </div>
          <div className="text-left md:text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
              Items in Bag
            </span>
            <span className="text-xl font-bold text-slate-800">
              {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
            </span>
          </div>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 space-y-6">
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          {/* Right Column: Calculations & Order Summaries */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-150/40 shadow-sm">
              <h2 className="text-xs font-bold text-slate-400 mb-6 uppercase tracking-widest">
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm text-slate-500 font-medium">
                  <span>Subtotal</span>
                  <span className="text-slate-800">₹{totalPrice.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-sm text-slate-500 font-medium">
                  <span>Shipping</span>
                  <span className="text-slate-950 font-extrabold uppercase text-[10px] bg-slate-100 px-2.5 py-0.5 rounded-md">
                    Free
                  </span>
                </div>
                
                <div className="flex justify-between text-sm text-slate-500 font-medium pb-2 border-b border-slate-50">
                  <span>GST (18%)</span>
                  <span className="text-slate-800">₹{computedGst.toLocaleString()}</span>
                </div>

                {appliedCode && (
                  <div className="flex justify-between text-sm text-emerald-600 font-semibold bg-emerald-50/55 p-2 rounded-lg border border-emerald-100/40">
                    <span className="flex items-center gap-1.5 uppercase">
                      <Ticket className="w-3.5 h-3.5" /> Code ({appliedCode})
                    </span>
                    <button
                      onClick={handleRemovePromo}
                      className="text-slate-400 hover:text-rose-500 text-xs font-bold"
                    >
                      [Remove]
                    </button>
                    <span>- ₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="pt-4 flex justify-between items-baseline text-slate-900 border-t border-slate-50">
                  <span className="font-extrabold text-slate-900 text-sm uppercase">Estimated Total</span>
                  <span className="font-extrabold text-slate-950 text-2xl tracking-tight">
                    ₹{finalEstimatedTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckoutNavigation}
                className="w-full bg-slate-950 text-[#D4FC79] py-4 rounded-xl font-bold text-sm hover:bg-slate-900 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
              >
                <span>Continue to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between opacity-70">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Guaranteed Safe Checkout
                </span>
                <div className="flex gap-2 text-slate-400">
                  <span className="text-[11px] font-extrabold text-slate-500 uppercase">Visa</span>
                  <span className="text-[11px] font-extrabold text-slate-500 uppercase">MCard</span>
                  <span className="text-[11px] font-extrabold text-slate-500 uppercase">UPI</span>
                </div>
              </div>
            </div>

            {/* Promo coupon wrapper bar */}
            <div className="bg-white p-5 rounded-3xl border border-slate-150/40 shadow-sm">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                Coupons / Discount Code
              </label>
              <div className="flex gap-2.5">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="e.g. DISCOUNT10"
                  className="bg-slate-50 border border-slate-200 rounded-xl w-full focus:ring-2 focus:ring-slate-100 focus:border-slate-950 text-xs font-medium px-4 py-3 outline-none transition-all placeholder:text-slate-300"
                />
                <button
                  onClick={handleApplyPromo}
                  className="bg-slate-900 text-white px-5 rounded-xl font-bold text-xs hover:bg-slate-950 hover:text-[#D4FC79] transition-colors shrink-0 outline-none"
                >
                  Apply
                </button>
              </div>
              {promoError && (
                <p className="text-rose-500 text-[11px] mt-2 font-medium bg-rose-50/50 p-2 rounded-lg border border-rose-100/50">
                  {promoError}
                </p>
              )}
              {!appliedCode && (
                <p className="text-slate-600 text-[10.5px] mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100 font-medium">
                  Try "DISCOUNT10" for 10% off or "SHOP50" for 50% off!
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;
