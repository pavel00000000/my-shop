import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';
import './Navigation.css';

const categories = [
  { id: 'all', name: 'Всі категорії' },
  { id: 'category1', name: 'Бокси' },
  { id: 'category2', name: 'Дитячі букети' },
  { id: 'category3', name: 'Чоловічі букети' },
  { id: 'category4', name: 'Солодкі букети' },
  { id: 'category5', name: 'Сухофрукти, фрукти' },
  { id: 'category6', name: 'Полуниця в шоколаді' },
  { id: 'category8', name: 'Квіти' },
];

const Navigation = () => {
  const { category = 'all' } = useParams();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isOpen, setIsOpen] = useState(false);

  // Отслеживание изменения размера окна
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      console.log('Navigation.js: Window resized, isMobile =', mobile);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    console.log('Navigation.js: toggleMenu called, isOpen =', !isOpen);
  };

  return (
    <nav className="navigation-navigation">
      {isMobile ? (
        <div className={`navigation-mobile-container ${isOpen ? 'open' : ''}`}>
          <button
            className="navigation-toggle-button"
            onClick={toggleMenu}
            aria-label={isOpen ? 'Згорнути категорії' : 'Розгорнути категорії'}
          >
            Категорії {isOpen ? <FiChevronDown size={16} /> : <FiChevronUp size={16} />}
          </button>
          <ul className="navigation-navigation-list">
            {categories.map((cat) => (
              <li
                key={cat.id}
                className={`navigation-navigation-item ${
                  cat.id === category ? 'active' : ''
                }`}
              >
                <Link to={`/catalog/${cat.id}`} onClick={() => setIsOpen(false)}>
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <ul className="navigation-navigation-list">
          {categories.map((cat) => (
            <li
              key={cat.id}
              className={`navigation-navigation-item ${
                cat.id === category ? 'active' : ''
              }`}
            >
              <Link to={`/catalog/${cat.id}`}>{cat.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default Navigation;