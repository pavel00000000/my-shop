import React, { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard';
import products from '../data/products.json'; // Импортируем сгенерированный products.json
import './ProductList.css'; // Импорт оригинального CSS-файла

const ProductList = ({ category, productsPerPage = 10 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('none');
  const itemsGridRef = useRef(null);

  // Фильтрация продуктов по категории
  const filteredProducts =
    category === 'all' ? products : products.filter((product) => product.category === category);

  // Пагинация
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Логи для отладки: состояние компонента
  useEffect(() => {
    console.log('ProductList: Текущая категория:', category);
    console.log('ProductList: Количество отфильтрованных продуктов:', filteredProducts.length);
    console.log('ProductList: Всего страниц (totalPages):', totalPages);
    console.log('ProductList: Текущая страница (currentPage):', currentPage);
    console.log('ProductList: Количество продуктов на странице (productsPerPage):', productsPerPage);
  }, [category, filteredProducts, totalPages, currentPage, productsPerPage]);

  // Сброс currentPage при смене категории или сортировки
  useEffect(() => {
    console.log('ProductList: Сброс currentPage на 1 из-за смены категории или сортировки');
    setCurrentPage(1);
  }, [category, sortOrder]);

  // Проверка, чтобы currentPage не превышал totalPages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      console.log('ProductList: currentPage больше totalPages, устанавливаем currentPage:', totalPages);
      setCurrentPage(totalPages);
    } else if (totalPages === 0 && currentPage !== 1) {
      console.log('ProductList: totalPages равно 0, сбрасываем currentPage на 1');
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  // Сортировка продуктов
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === 'low-to-high') {
      return a.price - b.price;
    } else if (sortOrder === 'high-to-low') {
      return b.price - a.price;
    }
    return 0;
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Обработчики для пагинации
  const handleNextPage = () => {
    console.log('ProductList: Нажата кнопка "Вперёд"');
    console.log('ProductList: Текущая страница до обновления:', currentPage);
    console.log('ProductList: Всего страниц:', totalPages);
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      console.log('ProductList: Устанавливаем новую страницу:', newPage);
      setCurrentPage(newPage);
    } else {
      console.log('ProductList: Нельзя перейти на следующую страницу, уже на последней');
    }
  };

  const handlePrevPage = () => {
    console.log('ProductList: Нажата кнопка "Назад"');
    console.log('ProductList: Текущая страница до обновления:', currentPage);
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      console.log('ProductList: Устанавливаем новую страницу:', newPage);
      setCurrentPage(newPage);
    } else {
      console.log('ProductList: Нельзя вернуться назад, уже на первой странице');
    }
  };

  // Обработчик изменения сортировки
  const handleSortChange = (e) => {
    console.log('ProductList: Изменение сортировки:', e.target.value);
    setSortOrder(e.target.value);
  };

  // Эффект для плавной прокрутки списка продуктов наверх при смене страницы
  useEffect(() => {
    if (itemsGridRef.current) {
      console.log('ProductList: Прокрутка списка продуктов наверх');
      itemsGridRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [currentPage]);

  // Лог для проверки рендера пагинации
  useEffect(() => {
    console.log('ProductList: JSX пагинации - Страница:', currentPage, 'из', totalPages);
  }, [currentPage, totalPages]);

  return (
    <div className="iitems-grid-container">
      {/* Блок сортировки */}
      {filteredProducts.length > 0 && (
        <div className="sort-panel">
          <label htmlFor="sort-select">Сортировать по цене: </label>
          <select id="sort-select" value={sortOrder} onChange={handleSortChange}>
            <option value="none">Без сортировки</option>
            <option value="low-to-high">От дешёвых к дорогим</option>
            <option value="high-to-low">От дорогих к дешёвым</option>
          </select>
        </div>
      )}

      {/* Список продуктов */}
      <div className="items-grid" ref={itemsGridRef}>
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <ProductCard key={product.id} product={product} view="grid" />
          ))
        ) : (
          <p>Товары отсутствуют.</p>
        )}
      </div>

      {/* Пагинация */}
      {filteredProducts.length > 0 && (
        <div className="qpage-nav">
          <div className="page-nav-inner">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="page-nav-button"
            >
              Назад
            </button>
            <span>Страница {currentPage} из {totalPages}</span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="page-nav-button"
            >
              Вперёд
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;