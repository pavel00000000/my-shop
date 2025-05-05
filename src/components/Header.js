import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaThList, FaShoppingCart, FaBars, FaInstagram, FaTelegram, FaPhone } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import './Header.css';
import logo from './logo.jpg';

const Header = () => {
  const { cartItems } = useContext(CartContext);
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    // Переключаем меню только на мобильной версии (≤768px)
    if (window.innerWidth <= 768) {
      setIsMenuOpen(!isMenuOpen);
      console.log('Header.js: toggleMenu called, isMenuOpen =', !isMenuOpen);
    }
  };

  // Сбрасываем isMenuOpen при изменении маршрута
  useEffect(() => {
    setIsMenuOpen(false);
    console.log('Header.js: Route changed, isMenuOpen reset to false, pathname =', location.pathname);
  }, [location.pathname]);

  // Список категорий
  const categories = [
    { path: '/catalog/all', name: 'Загальний роздiл' },
    { path: '/catalog/category1', name: 'Бокси' },
    { path: '/catalog/category2', name: 'Дитячі букети' },
    { path: '/catalog/category3', name: 'Чоловічі букети, коробки' },
    { path: '/catalog/category4', name: 'Солодкі букети, коробки' },
    { path: '/catalog/category5', name: 'Сухофрукти, фрукти' },
    { path: '/catalog/category6', name: 'Полуниця в шоколаді' },
    { path: '/catalog/category8', name: 'Квіти' },
  ];

  // Проверяем, не находимся ли мы на странице корзины
  const isCartPage = location.pathname.startsWith('/cart');
  console.log('Header.js: location.pathname =', location.pathname, 'isCartPage =', isCartPage, 'isMenuOpen =', isMenuOpen);

  // Отладка рендеринга подменю (только для десктопной версии)
  const shouldRenderSubmenu = window.innerWidth > 768 && !isCartPage;
  console.log('Header.js: shouldRenderSubmenu =', shouldRenderSubmenu);

  // Логирование перед рендерингом подменю
  if (shouldRenderSubmenu) {
    console.log('Header.js: Rendering categories-submenu');
  } else {
    console.log('Header.js: NOT rendering categories-submenu');
  }

  // Функции для открытия ссылок
  const openInstagram = () => {
    window.open('https://www.instagram.com/mix_buket_8?igsh=NWxweHZjNng4bWFl', '_blank');
  };

  const openTelegram = () => {
    window.open('https://t.me/Anna_Mneka', '_blank');
  };

  const callPhone = () => {
    window.location.href = 'tel:+380954042969';
  };

  return (
    <header className="header-header">
      <Link to="/" className="header-logo-link" aria-label="Логотип - на главную">
        <img src={logo} alt="Логотип" className="header-logo" />
      </Link>
      <div className="header-nav-container">
        <button className="header-burger-menu" onClick={toggleMenu} aria-label="Открыть меню">
          <FaBars />
        </button>
        <nav className={`header-nav ${isMenuOpen ? 'open' : ''}`} data-page={location.pathname}>
          <Link to="/" aria-label="Главная страница" onClick={toggleMenu}>
            <FaHome className="header-icon" />
            <span>Дом</span>
          </Link>
          <Link to="/catalog" aria-label="Каталог" onClick={toggleMenu}>
            <FaThList className="header-icon" />
            <span>Каталог</span>
          </Link>
          <Link to="/cart" aria-label="Корзина" onClick={toggleMenu}>
            <FaShoppingCart className="header-icon" />
            {totalItems > 0 && <span className="header-cart-indicator">{totalItems}</span>}
            <span>Корзина</span>
          </Link>
          {/* Подменю категорий только в десктопной версии и не на странице корзины */}
          {shouldRenderSubmenu && (
            <div className="header-categories-submenu">
              <span className="header-submenu-title">Категории</span>
              {categories.map((category) => (
                <Link
                  key={category.path}
                  to={category.path}
                  aria-label={category.name}
                  onClick={toggleMenu}
                  className={location.pathname === category.path ? 'active' : ''}
                >
                  <span>{category.name}</span>
                </Link>
              ))}
            </div>
          )}
          {/* Социальные иконки для мобильной версии в бургер-меню */}
          {isMenuOpen && !shouldRenderSubmenu && (
            <div className="header-mobile-social-icons">
              <button className="header-mobile-social-icon" onClick={openInstagram} aria-label="Instagram">
                <FaInstagram style={{ color: '#C13584' }} />
              </button>
              <button className="header-mobile-social-icon" onClick={openTelegram} aria-label="Telegram">
                <FaTelegram style={{ color: '#0088cc' }} />
              </button>
              <button className="header-mobile-social-icon" onClick={callPhone} aria-label="Позвонить">
                <FaPhone style={{ color: '#4CAF50' }} />
              </button>
            </div>
          )}
        </nav>
        {/* Социальные иконки для десктопной версии */}
        {window.innerWidth > 768 && (
          <div className="header-social-icons">
            <button className="header-social-icon" onClick={openInstagram} aria-label="Instagram">
              <FaInstagram style={{ color: '#C13584' }} />
            </button>
            <button className="header-social-icon" onClick={openTelegram} aria-label="Telegram">
              <FaTelegram style={{ color: '#0088cc' }} />
            </button>
            <button className="header-social-icon" onClick={callPhone} aria-label="Позвонить">
              <FaPhone style={{ color: '#4CAF50' }} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;