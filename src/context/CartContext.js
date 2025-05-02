import React, { createContext, useState } from 'react';

// Создаем контекст для корзины
export const CartContext = createContext();

// Провайдер контекста корзины
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]); // Состояние корзины

  // Добавление товара в корзину
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
    console.log('Товар добавлен:', product); // Лог для отладки
  };

  // Удаление товара из корзины
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  // Увеличение количества товара
  const increaseQuantity = (productId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Уменьшение количества товара
  const decreaseQuantity = (productId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === productId) {
          const newQuantity = item.quantity - 1;
          if (newQuantity <= 0) return null; // Удаляем товар, если количество <= 0
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter((item) => item !== null)
    );
  };

  // Очистка корзины
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};