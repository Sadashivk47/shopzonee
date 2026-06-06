import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Star, Truck, ShieldAlert, Minus, Plus, ChevronRight, Check } from 'lucide-react';
import { customProducts, enhanceProduct } from '../data/customProducts';

export const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Custom states
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedColor, setSelectedColor] = useState(0);
  const [addedMessage, setAddedMessage] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    // Check if it's our premium custom product range
    const productIdNum = Number(id);
    const customItem = customProducts.find(p => p.id === productIdNum);
    
    if (customItem) {
      const enhancedCustom = enhanceProduct(customItem);
      setProduct(enhancedCustom);
      setSelectedImage(enhancedCustom.thumbnail || enhancedCustom.images[0]);
      setLoading(false);
      return;
    }

    fetch(`https://dummyjson.com/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to retrieve item description. It might have been deleted or invalid.');
        return res.json();
      })
      .then((data) => {
        const scaledProduct = {
          ...data,
          price: Math.round(data.price * 85)
        };
        const enhancedProductItem = enhanceProduct(scaledProduct);
        setProduct(enhancedProductItem);
        setSelectedImage(enhancedProductItem.thumbnail || enhancedProductItem.images[0]);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const incrementQty = () => setQuantity((prev) => prev + 1);
  const decrementQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToBag = () => {
    if (!product) return;
    addToCart(product, quantity);
    
    // Feedback effect
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2005);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-40 min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-950 mb-4"></div>
        <p className="text-slate-400 text-xs font-semibold tracking-wider uppercase">Loading product specifications...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto text-center py-32 px-6 font-sans">
        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mx-auto mb-6">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Item Discovered Error</h2>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          {error || 'This item could not be found. Let\'s check another beautiful design instead.'}
        </p>
        <Link
          to="/shop"
          className="bg-slate-950 text-[#D4FC79] px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-900 transition-all shadow-xs"
        >
          Back to Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6 font-sans">
        {/* Breadcrumbs Navigation */}
        <nav className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-8 uppercase tracking-wider">
          <Link to="/shop" className="hover:text-slate-950 transition-colors">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-600 truncate">{product.category.replace('-', ' ')}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-950 font-bold max-w-[150px] truncate">{product.title}</span>
        </nav>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Image Galleries */}
          <section className="space-y-6">
            <div className="relative aspect-square bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm group">
              <img
                src={selectedImage}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-6 left-6">
                <span className="bg-slate-950 text-[#D4FC79] text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                  Premium Quality
                </span>
              </div>
            </div>

            {/* Carousel Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto py-2 no-scrollbar">
                {product.images.slice(0, 5).map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`w-20 h-20 rounded-2xl border-2 overflow-hidden bg-white cursor-pointer p-1 transition-all shrink-0 ${
                      selectedImage === imgUrl ? 'border-slate-950 shadow-sm scale-95' : 'border-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <img src={imgUrl} alt="Thumbnail preview" className="w-full h-full object-cover rounded-xl" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Right Column: Descriptions & Actions */}
          <section className="flex flex-col">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4 leading-tight">
              {product.title}
            </h1>

            {/* Review Indicators */}
            <div className="flex items-center flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/40">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-sm text-slate-800">{product.rating}</span>
                <span className="text-slate-300 text-[10px]">•</span>
                <span className="text-xs text-slate-400 font-semibold">(128 reviews)</span>
              </div>
              <div className="h-4 w-[1px] bg-slate-200"></div>
              <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-wider">Ready to Delivery</span>
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="mb-8 p-6 bg-white rounded-3xl border border-slate-150/40 shadow-sm">
              <div className="flex items-baseline gap-3 mb-1.5">
                <span className="text-3xl font-extrabold text-slate-950 tracking-tight">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.discountPercentage && product.discountPercentage > 0 && (
                  <>
                    <span className="text-slate-400 line-through text-md font-medium">
                      ₹{Math.round(product.price * (1 + product.discountPercentage / 100)).toLocaleString()}
                    </span>
                    <span className="text-emerald-500 text-xs font-extrabold uppercase bg-emerald-50 px-2 py-0.5 rounded-md">
                      {Math.round(product.discountPercentage)}% OFF
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2 font-medium">
                <Truck className="w-3.5 h-3.5 text-slate-400" />
                <span>Eligible for Free express shipping + 1 Year Extended Warranty</span>
              </div>
            </div>

            {/* Specifications Details */}
            <div className="space-y-6 mb-8 font-sans">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Specifications</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Grid characteristics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-white border border-slate-50 rounded-2xl shadow-xs">
                  <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-slate-800">
                    <Star className="w-4 h-4 fill-slate-700 text-slate-700" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Brand</span>
                    <span className="text-xs font-bold text-slate-800">{product.brand || 'ShopZone Pro'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white border border-slate-50 rounded-2xl shadow-xs">
                  <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-slate-800">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Stock Status</span>
                    <span className="text-xs font-bold text-slate-800">{product.stock || 24} Items Left</span>
                  </div>
                </div>
              </div>

              {/* Creative color swatches */}
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3">
                  Available Colors
                </span>
                <div className="flex gap-3">
                  {['#1E293B', '#E2E8F0', '#3B82F6'].map((colorCode, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(idx)}
                      className={`w-10 h-10 rounded-full border-4 border-white shadow-md transition-all select-none ${
                        selectedColor === idx ? 'ring-2 ring-slate-950 scale-105' : 'hover:scale-102 hover:ring-2 hover:ring-slate-300'
                      }`}
                      style={{ backgroundColor: colorCode }}
                      aria-label={`Select Color Option ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Active Control Action Block (Sticky-ready layout) */}
            <div className="flex items-center gap-4 pt-6 border-t border-slate-100 font-sans">
              <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm shrink-0">
                <button
                  onClick={decrementQty}
                  className="w-11 h-11 flex items-center justify-center hover:bg-slate-50 text-slate-600 hover:text-slate-950 rounded-lg transition-colors focus:outline-none"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4 font-bold" />
                </button>
                <span className="w-12 text-center font-extrabold text-sm text-slate-800">
                  {quantity}
                </span>
                <button
                  onClick={incrementQty}
                  className="w-11 h-11 flex items-center justify-center hover:bg-slate-50 text-slate-600 hover:text-slate-950 rounded-lg transition-colors focus:outline-none"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4 font-bold" />
                </button>
              </div>

              <button
                onClick={handleAddToBag}
                className={`flex-grow h-[52px] rounded-xl font-bold text-sm shadow-lg hover:shadow-slate-200 hover:-translate-y-0.5 active:translate-y-0 select-none transition-all duration-300 flex items-center justify-center gap-2 ${
                  addedMessage
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-950 text-[#D4FC79] shadow-xs'
                }`}
              >
                {addedMessage ? (
                  <>
                    <Check className="w-4 h-4 animate-bounce" /> Added to Cart!
                  </>
                ) : (
                  <>
                    Add to Bag — ₹{(product.price * quantity).toLocaleString()}
                  </>
                )}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
