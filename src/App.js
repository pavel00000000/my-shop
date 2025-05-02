import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductPage from './pages/ProductPage';
import Cart from './pages/Cart';
import './App.css';

// Компонент маршрутов для лучшей читаемости
const RoutesComponent = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/catalog" element={<Catalog />} />
    <Route path="/catalog/:category" element={<Catalog />} />
    <Route path="/product/:id" element={<ProductPage />} />
    <Route path="/cart" element={<Cart />} />
  </Routes>
);

// Компонент Layout с условной навигацией
const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isCatalogPage = location.pathname.startsWith('/catalog');
  const isCartPage = location.pathname.startsWith('/cart');

  console.log('App.js: location.pathname =', location.pathname, 'isCartPage =', isCartPage);

  return (
    <div className="app-container">
      <Header />
      {/* Рендерим Navigation только в десктопной версии и не на главной, каталоге или корзине */}
      {!isHomePage && !isCatalogPage && !isCartPage && window.innerWidth > 768 && <Navigation />}
      <main className="main-content">
        <RoutesComponent />
      </main>
    </div>
  );
};

// Основной компонент приложения
const App = () => (
  <Router>
    <CartProvider>
      <Layout />
    </CartProvider>
  </Router>
);

export default App;