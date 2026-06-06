import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { Search, SlidersHorizontal, PackageOpen } from 'lucide-react';
import { customProducts, enhanceProduct } from '../data/customProducts';

export const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search and URL parameters
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';

  // Local state for states
  const [activeTab, setActiveTab] = useState('all');
  const [searchVal, setSearchVal] = useState(searchParam);

  useEffect(() => {
    // Sync local input with URL param if it changes
    setSearchVal(searchParam);
  }, [searchParam]);

  // Fetch products
  useEffect(() => {
    setLoading(true);
    fetch('https://dummyjson.com/products?limit=100')
      .then((res) => {
        if (!res.ok) throw new Error('Could not fetch the product catalog.');
        return res.json();
      })
      .then((data) => {
        const scaledProducts = data.products.map(p => ({
          ...p,
          price: Math.round(p.price * 85)
        }));
        // Merge custom premium body care products at the absolute beginning
        setProducts([...customProducts, ...scaledProducts].map(enhanceProduct));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Filter products based on param, active tab, and search keyword
  useEffect(() => {
    let result = [...products];

    // Priority 1: Category Param (e.g. from Home category cards)
    if (categoryParam) {
      const param = categoryParam.toLowerCase();
      if (param === 'electronics') {
        result = result.filter(p =>
          ['smartphones', 'laptops', 'mobile-accessories', 'tablets'].includes(p.category)
        );
      } else if (param === 'fashion') {
        result = result.filter(p =>
          ['mens-shirts', 'mens-shoes', 'mens-watches', 'womens-bags', 'womens-dresses', 'womens-jewellery', 'womens-shoes', 'womens-watches', 'tops', 'sunglasses'].includes(p.category)
        );
      } else if (param === 'beauty' || param === 'skincare') {
        result = result.filter(p =>
          ['beauty', 'skin-care', 'fragrances'].includes(p.category)
        );
      } else if (param === 'body') {
        result = result.filter(p =>
          ['skin-care', 'beauty'].includes(p.category)
        );
      } else if (param === 'furniture') {
        result = result.filter(p =>
          ['furniture', 'home-decoration'].includes(p.category)
        );
      } else {
        result = result.filter(p => p.category.toLowerCase() === param);
      }
    }

    // Priority 2: Standard Tab selections
    if (activeTab === 'essentials') {
      result = result.filter(p =>
        ['beauty', 'skin-care', 'groceries', 'fragrances'].includes(p.category)
      );
    } else if (activeTab === 'accessories') {
      result = result.filter(p =>
        ['smartphones', 'laptops', 'mobile-accessories', 'tablets', 'mens-watches', 'womens-watches'].includes(p.category)
      );
    } else if (activeTab === 'new-arrivals') {
      // New arrivals mapped to rating >= 4.5 or similar high benchmark
      result = result.filter(p => p.rating >= 4.5);
    }

    // Priority 3: Search keyword
    if (searchParam) {
      const query = searchParam.toLowerCase();
      result = result.filter(
        p =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(result);
  }, [products, categoryParam, activeTab, searchParam]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchVal(val);
    
    // Update trigger parameters
    const nextParams = new URLSearchParams(searchParams);
    if (val) {
      nextParams.set('search', val);
    } else {
      nextParams.delete('search');
    }
    setSearchParams(nextParams);
  };

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    // Clear category param if tab overrides the link filter
    if (categoryParam) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('category');
      setSearchParams(nextParams);
    }
  };

  const clearFilters = () => {
    setSearchVal('');
    setActiveTab('all');
    setSearchParams({});
  };

  return (
    <div className="bg-slate-50/50 min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 font-sans">
        
        {/* Head Intro */}
        <section className="mb-10 text-center md:text-left">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Browse Collections
          </h2>
          <p className="text-slate-500 text-sm sm:text-base max-w-2xl leading-relaxed">
            Discover our curated selection of premium essentials designed for the modern lifestyle. Quality meets minimalism in every piece.
          </p>
        </section>

        {/* Filter & Search Bar */}
        <section className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between border-b border-slate-100 pb-6">
          {/* Smart category tab selectors */}
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar py-2">
            <button
              onClick={() => handleTabChange('all')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all duration-300 ${
                activeTab === 'all' && !categoryParam
                  ? 'bg-slate-950 text-[#D4FC79] shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => handleTabChange('essentials')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all duration-300 ${
                activeTab === 'essentials'
                  ? 'bg-slate-950 text-[#D4FC79] shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
              }`}
            >
              Essentials
            </button>
            <button
              onClick={() => handleTabChange('accessories')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all duration-300 ${
                activeTab === 'accessories'
                  ? 'bg-slate-950 text-[#D4FC79] shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
              }`}
            >
              Accessories
            </button>
            <button
              onClick={() => handleTabChange('new-arrivals')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all duration-300 ${
                activeTab === 'new-arrivals'
                  ? 'bg-slate-950 text-[#D4FC79] shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
              }`}
            >
              New Arrivals
            </button>
            
            {categoryParam && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-950 text-[#D4FC79] text-xs font-bold rounded-xl border border-slate-900 uppercase tracking-wider select-none">
                Filtered: {categoryParam}
              </span>
            )}
          </div>

          {/* Search Inputs */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchVal}
                onChange={handleSearchChange}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-100 focus:border-slate-950 outline-none transition-all text-xs font-medium text-slate-705 placeholder:text-slate-400"
              />
            </div>
            <button
              onClick={clearFilters}
              className="p-2.5 bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors"
              title="Reset Filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Dynamic State Layout Renderings */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-950 mb-4"></div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
              Fetching catalog collections...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 max-w-xl mx-auto p-8 shadow-sm">
            <PackageOpen className="w-12 h-12 text-rose-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">Network Retrieval Failed</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-slate-950 text-[#D4FC79] rounded-xl font-bold text-xs hover:bg-slate-900 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 max-w-xl mx-auto p-12 shadow-sm">
            <PackageOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">No items discovered</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              We couldn't discover any items matching your filter search. Try broadening your terms or resetting.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2.5 bg-slate-950 text-[#D4FC79] rounded-xl font-bold text-xs hover:bg-slate-900 transition-colors"
            >
              Reset Search & Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
