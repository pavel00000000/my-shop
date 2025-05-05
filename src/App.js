import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductPage from './pages/ProductPage';
import Cart from './pages/Cart';
import './App.css';

// Категории для мета-тегов
const categories = [
  { path: '/catalog/all', name: 'Загальний роздiл', ukr: 'купити подарунки київ', rus: 'купить подарки киев' },
  { path: '/catalog/category1', name: 'Бокси', ukr: 'подарункові бокси київ', rus: 'подарочные боксы киев' },
  { path: '/catalog/category2', name: 'Дитячі букети', ukr: 'дитячі букети київ', rus: 'детские букеты киев' },
  { path: '/catalog/category3', name: 'Чоловічі букети, коробки', ukr: 'чоловічі букети київ', rus: 'мужские букеты киев' },
  { path: '/catalog/category4', name: 'Солодкі букети, коробки', ukr: 'солодкі букети київ', rus: 'сладкие букеты киев' },
  { path: '/catalog/category5', name: 'Сухофрукти, фрукти', ukr: 'сухофрукти подарункові київ', rus: 'сухофрукты подарочные киев' },
  { path: '/catalog/category6', name: 'Полуниця в шоколаді', ukr: 'полуниця в шоколаді київ', rus: 'клубника в шоколаде киев' },
  { path: '/catalog/category8', name: 'Квіти', ukr: 'квіти київ замовити', rus: 'цветы киев заказать' },
];

// Компонент Layout
const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isCatalogPage = location.pathname.startsWith('/catalog');
  const isCartPage = location.pathname.startsWith('/cart');

  console.log('App.js: location.pathname =', location.pathname, 'isCartPage =', isCartPage);

  // Отслеживание просмотров страниц
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'pageview',
      page_path: location.pathname,
      page_title: document.title,
    });
  }, [location.pathname]);

  // Динамические мета-теги
  const getMetaTags = () => {
    const path = location.pathname;
    if (path === '/') {
      return {
        title: 'Купити Солодкі Букети в Києві | My Shop',
        description: 'Замовляйте солодкі букети, подарункові бокси та квіти в Києві. Швидка доставка!',
        keywords: 'купити подарунки київ, солодкі букети, сладкие букеты киев, подарунки для дітей',
      };
    } else if (path === '/catalog') {
      return {
        title: 'Каталог Подарунків та Букетів | My Shop Київ',
        description: 'Ознайомтеся з каталогом солодких букетів, дитячих подарунків та коробок у Києві.',
        keywords: 'каталог букетів, дитячі подарунки, сладкие букеты киев, подарункові бокси',
      };
    } else if (path === '/cart') {
      return {
        title: 'Кошик | Оформити Замовлення в Києві | My Shop',
        description: 'Оформіть замовлення солодких букетів, подарункових боксів та квітів у Києві.',
        keywords: 'оформити замовлення київ, заказать подарки киев, кошик подарунків, корзина киев',
      };
    } else if (path.startsWith('/catalog/')) {
      const categoryId = path.split('/')[2]; // Например, 'category1'
      const category = categories.find((c) => c.path === `/catalog/${categoryId}`);
      if (category) {
        return {
          title: `${category.name} | Купити в Києві | My Shop`,
          description: `Замовляйте ${category.name.toLowerCase()} у Києві. Швидка доставка, доступні ціни!`,
          keywords: `${category.ukr}, ${category.rus}, подарунки київ, замовити в києві`,
        };
      }
    }
    return {
      title: 'My Shop | Подарунки та Букети в Києві',
      description: 'Найкращі солодкі букети та подарунки в Києві. Замовляйте зараз!',
      keywords: 'подарунки київ, солодкі букети, сладкие букеты киев',
    };
  };

  const { title, description, keywords } = getMetaTags();

  // Структурированные данные для организации
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'My Shop',
    url: 'https://my-shop-7mpy.onrender.com',
    logo: 'https://my-shop-7mpy.onrender.com/logo.jpg', // Замените на реальный URL логотипа
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+380123456789', // Замените на реальный номер
      contactType: 'customer service',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Кропивницький',
      addressCountry: 'UA',
    },
  };

  return (
    <div className="app-home-container">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="robots" content={isCartPage ? 'noindex, follow' : 'index, follow'} />
        <meta name="language" content="uk" />
        <link rel="canonical" href={`https://my-shop-7mpy.onrender.com${location.pathname}`} />
        <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
      </Helmet>
      <Header />
      {!isHomePage && !isCatalogPage && !isCartPage && window.innerWidth > 768 && <Navigation />}
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/:category" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
};

// Основной компонент приложения
const App = () => (
  <HelmetProvider>
    <Router>
      <CartProvider>
        <Layout />
      </CartProvider>
    </Router>
  </HelmetProvider>
);

export default App;