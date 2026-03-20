import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(
    localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []
  );
  const [appliedCoupon, setAppliedCoupon] = useState(
    localStorage.getItem('appliedCoupon') ? JSON.parse(localStorage.getItem('appliedCoupon')) : null
  );

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('appliedCoupon', JSON.stringify(appliedCoupon));
  }, [appliedCoupon]);

  const addToCart = useCallback((product, qty) => {
    setAppliedCoupon(null); // Clear coupon when new item is added
    setCartItems((prevItems) => {
      const existItem = prevItems.find((x) => x.product === product._id);
      if (existItem) {
        return prevItems.map((x) =>
          x.product === product._id ? { ...existItem, qty: existItem.qty + qty } : x
        );
      } else {
        const finalPrice = (product.sale_price > 0 && product.sale_price < product.price) 
          ? product.sale_price 
          : product.price;

        return [...prevItems, { 
          product: product._id, 
          name: product.title, 
          image: product.images?.[0], 
          price: finalPrice, 
          countInStock: product.countInStock || 100,
          slug: product.slug,
          category: product.categories?.[0],
          qty 
        }];
      }
    });
  }, [setAppliedCoupon]);

  const updateCartQty = useCallback((id, newQty) => {
    setAppliedCoupon(null); // Clear coupon when quantity changes
    setCartItems((prevItems) =>
      prevItems.map((x) =>
        x.product === id ? { ...x, qty: Math.max(1, Math.min(x.countInStock, newQty)) } : x
      )
    );
  }, [setAppliedCoupon]);

  const removeFromCart = useCallback((id) => {
    setAppliedCoupon(null); // Clear coupon when item removed
    setCartItems((prevItems) => prevItems.filter((x) => x.product !== id));
  }, [setAppliedCoupon]);

  const clearCart = useCallback(() => {
    setAppliedCoupon(null);
    setCartItems([]);
  }, [setAppliedCoupon]);

  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen(prev => !prev), []);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateCartQty, 
      clearCart,
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
      appliedCoupon,
      setAppliedCoupon
    }}>
      {children}
    </CartContext.Provider>
  );
};
