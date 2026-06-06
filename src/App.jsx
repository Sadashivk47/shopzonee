// FE DEV NOTE: Configured our client-side routing container structure to meet sprint deliverables.
// Used BrowserRouter for seamless view rendering without triggering an expensive full page reload.
// Set up standard paths for '/' (Home), '/shop' (Catalog), and secure routes like '/checkout'.
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages import
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Login } from './pages/Login';
import { Checkout } from './pages/Checkout';
import { Contact } from './pages/Contact';

// Protected Route wrapper import
// FE SPRINT ADVICE: ProtectedRoute acts as an intercept middleware checking 'isLoggedIn' auth state from Context.
import { ProtectedRoute } from './components/ProtectedRoute';
import { AIShopAdvisor } from './components/AIShopAdvisor';

export default function App() {
  return (
    <Router>
      <CartProvider>
        <div className="flex flex-col min-h-screen bg-slate-50/20 antialiased selection:bg-[#D4FC79]/30 selection:text-slate-900">
          
          {/* Persisted Sticky Top Header with dynamic global cart count indicators */}
          <Navbar />
          
          {/* Scrollable Layout Context */}
          <div className="flex-grow">
            <Routes>
              {/* Home Route (welcome banner, hero selection grid) */}
              <Route path="/" element={<Home />} />
              
              {/* Collections Search & Catalogues Page - fetches products dynamically */}
              <Route path="/shop" element={<Shop />} />
              
              {/* Dynamic Product Detail routes: loads useParams() to locate the product ID */}
              <Route path="/product/:id" element={<ProductDetails />} />
              
              {/* Shopping Bag detail page and interactive price aggregates calculations */}
              <Route path="/cart" element={<Cart />} />
              
              {/* Static Contact Details info page (Hyderabad HQ contact information details) */}
              <Route path="/contact" element={<Contact />} />
              
              {/* Mock Guest Authorizations login page - handles simulated credentials */}
              <Route path="/login" element={<Login />} />
              
              {/* Protected Route with Navigate handler redirects - redirects unauthorized clients straight back to /login */}
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>

          {/* Floating Gemini-powered Personal Style Consultant */}
          <AIShopAdvisor />

          {/* Persisted Layout Footer */}
          <Footer />
          
        </div>
      </CartProvider>
    </Router>
  );
}
