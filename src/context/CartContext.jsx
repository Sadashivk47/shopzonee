import React, { createContext, useContext, useState, useEffect } from 'react';

// SPRINT NOTE ON STATE CHOICES:
// To avoid messy Prop Drilling through parent-child routes, we establish a global CartContext.
// This matches Phase 2 specifications, hosting both checkout cart actions and mock user login profiles.
const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  // Load initial cartItems from localStorage to withstand sudden browser refreshes (Local State Persistence requirement)
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('shopzone_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Load initial login/guest status from localStorage
  const [currentUser, setCurrentUser] = useState(null);
  const [userToken, setUserToken] = useState(() => {
    return localStorage.getItem('shopzone_token') || null;
  });
  const [loadingUser, setLoadingUser] = useState(true);
  const [dbStatus, setDbStatus] = useState({
    dbMode: 'sqlite-fallback',
    externalConfigured: false,
    dbError: null
  });

  const isLoggedIn = !!currentUser;

  // Poll database status on application mount
  const fetchDbStatus = async () => {
    try {
      const res = await fetch('/api/db-status');
      if (res.ok) {
        const data = await res.json();
        setDbStatus({
          dbMode: data.dbMode,
          externalConfigured: data.externalConfigured,
          dbError: data.dbError,
          configuredUrlHint: data.configuredUrlHint
        });
      }
    } catch (e) {
      console.error("Failed to read database state status:", e);
    }
  };

  // Validate active JWT token on mount to hydrate authentication state
  useEffect(() => {
    const validateToken = async () => {
      setLoadingUser(true);
      await fetchDbStatus();
      const token = localStorage.getItem('shopzone_token');
      
      if (!token) {
        // Look if there's a stored active guest user to sustain layout
        const savedUser = localStorage.getItem('shopzone_current_user');
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          if (parsed.isGuest) {
            setCurrentUser(parsed);
          }
        }
        setLoadingUser(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setCurrentUser(data.user);
          localStorage.setItem('shopzone_current_user', JSON.stringify(data.user));
        } else {
          // Token is dead, wipe credentials
          localStorage.removeItem('shopzone_token');
          localStorage.removeItem('shopzone_current_user');
          setCurrentUser(null);
          setUserToken(null);
        }
      } catch (err) {
        console.error("Auth hydration sequence error:", err);
      } finally {
        setLoadingUser(false);
      }
    };

    validateToken();
  }, [userToken]);

  // Whenever cart change happens, we update localStore instantly to ensure survivability across hard reloads
  useEffect(() => {
    localStorage.setItem('shopzone_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantityToAdd = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      } else {
        return [
          ...prevItems,
          {
            id: product.id,
            title: product.title,
            price: product.price,
            thumbnail: product.thumbnail || (product.images && product.images[0]) || '',
            quantity: quantityToAdd,
            description: product.description,
            category: product.category,
          },
        ];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // 1. Log in Action with Real API endpoint
  const loginUser = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Authenication failed.');
    }

    localStorage.setItem('shopzone_token', data.token);
    localStorage.setItem('shopzone_current_user', JSON.stringify(data.user));
    setUserToken(data.token);
    setCurrentUser(data.user);
    return data.user;
  };

  // 2. Registration Action with Real API endpoint
  const registerUser = async (name, email, password) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed.');
    }

    // FE SPRINT DESIGN OPTION: We return the user data so the signup dialog can say successful,
    // but we do NOT set currentUser or token here, making visitors manually type their password once first.
    return data.user;
  };

  // 3. Guest login bypass
  const loginGuest = () => {
    const guestUser = { id: 'fb-guest', name: 'Guest User', email: 'guest@shopzone.com', isGuest: true };
    localStorage.removeItem('shopzone_token'); // Clear previous real tokens on guest access
    localStorage.setItem('shopzone_current_user', JSON.stringify(guestUser));
    setUserToken(null);
    setCurrentUser(guestUser);
  };

  const logout = () => {
    localStorage.removeItem('shopzone_token');
    localStorage.removeItem('shopzone_current_user');
    setUserToken(null);
    setCurrentUser(null);
  };

  // Compute stats dynamically
  const totalPrice = parseFloat(
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)
  );
  
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
        totalItems,
        isLoggedIn,
        currentUser,
        loadingUser,
        dbStatus,
        loginUser,
        registerUser,
        loginGuest,
        logout,
        fetchDbStatus,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
