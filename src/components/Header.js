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
    setIsMenuOpen(!isMenuOpen);
    console.log('Header.js: toggleMenu called, isMenuOpen =', !isMenuOpen);
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
    window.open('https://www.instagram.com/yourprofile', '_blank');
  };

  const openTelegram = () => {
    window.open('https://t.me/yourprofile', '_blank');
  };

  const callPhone = () => {
    window.location.href = 'tel:+1234567890';
  };

  return (
    <header className="header">
      <Link to="/" className="logo-link" aria-label="Логотип - на главную">
        <img src={logo} alt="Логотип" className="logo" />
      </Link>
      <div className="nav-container">
        <button className="burger-menu" onClick={toggleMenu} aria-label="Открыть меню">
          <FaBars />
        </button>
        <nav className={`nav ${isMenuOpen ? 'open' : ''}`} data-page={location.pathname}>
          <Link to="/" aria-label="Главная страница" onClick={toggleMenu}>
            <FaHome className="icon" />
            <span>Дом</span>
          </Link>
          <Link to="/catalog" aria-label="Каталог" onClick={toggleMenu}>
            <FaThList className="icon" />
            <span>Каталог</span>
          </Link>
          <Link to="/cart" aria-label="Корзина" onClick={toggleMenu}>
            <FaShoppingCart className="icon" />
            {totalItems > 0 && <span className="cart-indicator">{totalItems}</span>}
            <span>Корзина</span>
          </Link>
          {/* Подменю категорий только в десктопной версии и не на странице корзины */}
          {shouldRenderSubmenu && (
            <div className="categories-submenu">
              <span className="submenu-title">Категории</span>
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
            <div className="mobile-social-icons">
              <button className="mobile-social-icon" onClick={openInstagram} aria-label="Instagram">
                <FaInstagram style={{ color: '#C13584' }} />
              </button>
              <button className="mobile-social-icon" onClick={openTelegram} aria-label="Telegram">
                <FaTelegram style={{ color: '#0088cc' }} />
              </button>
              <button className="mobile-social-icon" onClick={callPhone} aria-label="Позвонить">
                <FaPhone style={{ color: '#4CAF50' }} />
              </button>
            </div>
          )}
        </nav>
        {/* Социальные иконки для десктопной версии */}
        {!isMenuOpen && window.innerWidth > 768 && (
          <div className="social-icons">
            <button className="social-icon" onClick={openInstagram} aria-label="Instagram">
              <FaInstagram style={{ color: '#C13584' }} />
            </button>
            <button className="social-icon" onClick={openTelegram} aria-label="Telegram">
              <FaTelegram style={{ color: '#0088cc' }} />
            </button>
            <button className="social-icon" onClick={callPhone} aria-label="Позвонить">
              <FaPhone style={{ color: '#4CAF50' }} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;