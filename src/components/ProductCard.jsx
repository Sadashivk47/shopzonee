import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Star, ShoppingCart, Tag } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-100 flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-100/40">
      {/* Product Image Section */}
      <Link to={`/product/${product.id}`} className="relative aspect-[4/5] bg-slate-50 overflow-hidden block">
        <img
          src={product.thumbnail || product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        
        {/* Category Label */}
        {product.category && (
          <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-slate-950 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-slate-100 shadow-xs flex items-center gap-1.5">
            <Tag className="w-2.5 h-2.5 text-slate-800" />
            {product.category.replace('-', ' ')}
          </span>
        )}

        {/* Quick Add Button */}
        <button
          onClick={handleQuickAdd}
          className="absolute bottom-4 right-4 bg-slate-950 hover:bg-slate-900 text-[#D4FC79] p-3 rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-md focus:outline-none shrink-0"
          title="Add to Cart"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
        </button>
      </Link>

      {/* Product Details Section */}
      <div className="p-5 flex flex-col flex-grow font-sans">
        <Link to={`/product/${product.id}`} className="block group-hover:text-slate-950 transition-colors">
          <h3 className="text-base font-bold text-slate-950 tracking-tight leading-snug line-clamp-1 mb-1 font-display">
            {product.title}
          </h3>
        </Link>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-3 select-none">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="text-[11px] font-extrabold text-slate-700">{product.rating}</span>
          <span className="text-slate-350 text-[10px]">•</span>
          <span className="text-[10px] text-[#22c55e] font-extrabold tracking-wide uppercase">In Stock</span>
        </div>

        {/* Description Snippet */}
        <p className="text-xs text-slate-400 mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Pricing */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-base font-extrabold text-slate-950">₹{product.price.toLocaleString()}</span>
            {product.discountPercentage && product.discountPercentage > 0 && (
              <span className="text-[10px] font-bold text-rose-500">
                {Math.round(product.discountPercentage)}% Off
              </span>
            )}
          </div>
          
          <Link
            to={`/product/${product.id}`}
            className="text-[10px] uppercase font-bold tracking-widest text-slate-500 hover:text-slate-950 group-hover:underline transition-all"
          >
            Explore
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
