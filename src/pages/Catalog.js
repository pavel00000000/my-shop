import React from 'react';
import { useParams } from 'react-router-dom';
import Navigation from '../components/Navigation';
import ProductList from '../components/ProductList';
import './Catalog.css';

const Catalog = () => {
  const { category = 'all' } = useParams();

  // Логируем текущую категорию и рендеринг для отладки
  console.log('Текущая категория:', category);
  console.log('Catalog рендерится');

  // Названия категорий для отображения
  const categoryNames = {
    all: 'Загальний роздiл',
    category1: 'Бокси',
    category2: 'Дитячі букети',
    category3: 'Чоловічі букети, коробки',
    category4: 'Солодкі букети, коробки',
    category5: 'Сухофрукти, фрукти',
    category6: 'Полуниця в шоколаді',
    category8: 'Квіти',
  };

  // Настройки productsPerPage для каждой категории
  const categorySettings = {
    all: { productsPerPage: 4 },
    category1: { productsPerPage: 4 },
    category2: { productsPerPage: 4 },
    category3: { productsPerPage: 4 },
    category4: { productsPerPage: 4 },
    category5: { productsPerPage: 4 },
    category6: { productsPerPage: 4 },
    category7: { productsPerPage: 4 },
    category8: { productsPerPage: 4 },
  };

  const currentCategory = categorySettings[category] || categorySettings.all;
  const categoryName = categoryNames[category] || 'Загальний роздiл';

  return (
    <div className="catalog-container">
      {/* Navigation рендерится только в десктопной версии */}
      {window.innerWidth > 768 && <Navigation />}
      {/*<h1 className="category-title">{categoryName}</h1>*/}
      <ProductList
        key={category}
        category={category}
        productsPerPage={currentCategory.productsPerPage}
      />
    </div>
  );
};

export default Catalog;