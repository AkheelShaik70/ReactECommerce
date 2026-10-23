import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const CartContext = createContext(null);
const CART_STORAGE_KEY = 'luxemart_cart_v1';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Ignore storage quota or private mode issues
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    if (!product || !product.id) return;
    const qtyToAdd = Math.max(1, Number(quantity) || 1);

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === product.id);
      const maxStock = product.stock || 99;
      if (existingIndex > -1) {
        return prev.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: Math.min(maxStock, item.quantity + qtyToAdd) }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          brand: product.brand || 'LuxeMart Essentials',
          category: product.category,
          price: Number(product.price) || 0,
          discountPercentage: Number(product.discountPercentage) || 0,
          thumbnail: product.thumbnail || (product.images && product.images[0]) || '',
          stock: maxStock,
          quantity: Math.min(maxStock, qtyToAdd),
        },
      ];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    const parsed = Number(newQuantity);
    if (parsed <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.min(item.stock || 99, parsed) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totals = useMemo(() => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalDiscount = cartItems.reduce((sum, item) => {
      const discountFraction = (item.discountPercentage || 0) / 100;
      return sum + item.price * discountFraction * item.quantity;
    }, 0);
    const discountedSubtotal = Math.max(0, subtotal - totalDiscount);
    const estimatedTax = discountedSubtotal * 0.08;
    const shipping = discountedSubtotal > 0 ? (discountedSubtotal >= 100 ? 0 : 9.99) : 0;
    const totalPrice = discountedSubtotal + estimatedTax + shipping;

    return {
      totalItems,
      subtotal,
      totalDiscount,
      discountedSubtotal,
      estimatedTax,
      shipping,
      totalPrice,
    };
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        ...totals,
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
