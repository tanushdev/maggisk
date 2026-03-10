import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(
    localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []
  );

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty) => {
    const existItem = cartItems.find((x) => x.product === product._id);

    if (existItem) {
      setCartItems(
        cartItems.map((x) =>
          x.product === product._id ? { ...existItem, qty: existItem.qty + qty } : x
        )
      );
    } else {
      setCartItems([...cartItems, { 
        product: product._id, 
        name: product.name, 
        image: product.images[0], 
        price: product.price, 
        countInStock: product.countInStock,
        slug: product.slug,
        category: product.category,
        qty 
      }]);
    }
  };

  const updateCartQty = (id, newQty) => {
    setCartItems(
      cartItems.map((x) =>
        x.product === id ? { ...x, qty: Math.max(1, Math.min(x.countInStock, newQty)) } : x
      )
    );
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((x) => x.product !== id));
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateCartQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
