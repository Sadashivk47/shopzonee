import React from 'react';
import { useCart } from '../context/CartContext';
import { Plus, Minus, Trash2 } from 'lucide-react';

export const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="cart-item bg-white border border-slate-100 rounded-2xl overflow-hidden group hover:border-slate-300 transition-all duration-300">
      <div className="flex flex-col sm:flex-row">
        {/* thumbnail */}
        <div className="w-full sm:w-40 h-40 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 relative">
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* content */}
        <div className="flex-grow p-6 flex flex-col justify-between font-sans">
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-1">
              <div>
                <h3 className="text-[17px] font-bold text-slate-900 group-hover:text-slate-950 transition-colors">
                  {item.title}
                </h3>
                {item.category && (
                  <span className="inline-block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                    {item.category.replace('-', ' ')}
                  </span>
                )}
              </div>
              <div className="text-left sm:text-right shrink-0">
                <span className="text-lg font-bold text-slate-900 block">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </span>
                <span className="text-xs text-slate-400">
                  ₹{item.price.toLocaleString()} each
                </span>
              </div>
            </div>
            {item.description && (
              <p className="text-xs text-slate-400 line-clamp-1 mt-2 mb-4">
                {item.description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
            {/* Quantity Controller */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-150/40">
              <button
                onClick={() => updateQuantity(item.id, -1)}
                className="w-8 h-8 flex items-center justify-center hover:bg-white text-slate-600 hover:text-slate-950 rounded-lg transition-all focus:outline-none"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 font-bold text-sm min-w-[36px] text-center text-slate-800">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.id, 1)}
                className="w-8 h-8 flex items-center justify-center hover:bg-white text-slate-600 hover:text-slate-950 rounded-lg transition-all focus:outline-none"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-slate-400 hover:text-rose-600 font-semibold text-xs flex items-center gap-1.5 transition-colors uppercase tracking-wider px-2 py-1 hover:bg-rose-50 rounded-lg"
              title="Remove item"
            >
              <Trash2 className="w-4 h-4" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
