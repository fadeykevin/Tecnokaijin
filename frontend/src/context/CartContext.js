import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // ✅ Inicializar desde localStorage si existe
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error al cargar carrito desde localStorage:', error);
      return [];
    }
  });

  // ✅ Guardar en localStorage cada vez que cambie el carrito
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
      console.log('💾 Carrito guardado en localStorage:', cart.length, 'items');
    } catch (error) {
      console.error('Error al guardar carrito:', error);
    }
  }, [cart]);

  const addToCart = (product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      
      if (existingItem) {
        // Si ya existe, aumentar cantidad
        console.log('📦 Cantidad aumentada:', product.name);
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      // Si no existe, agregarlo con cantidad 1
      console.log('✅ Producto agregado al carrito:', product.name);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => {
      const filtered = prev.filter(item => item.id !== id);
      console.log('🗑️ Producto eliminado del carrito');
      return filtered;
    });
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setCart(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
    console.log('🔄 Cantidad actualizada');
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const clearCart = () => {
    setCart([]);
    console.log('🧹 Carrito vaciado');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        getCartTotal,
        getCartCount,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }

  return context;
};