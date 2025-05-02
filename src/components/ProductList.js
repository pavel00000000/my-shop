import React, { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard';
import products from '../data/products.json'; // Импортируем сгенерированный products.json
import './ProductList.css';

const ProductList = ({ category, productsPerPage = 10 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('none');
  const productListRef = useRef(null);

  // Фильтрация продуктов по категории
  const filteredProducts = category === 'all' ? products : products.filter(product => product.category === category);

  // Сортировка продуктов
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === 'low-to-high') {
      return a.price - b.price;
    } else if (sortOrder === 'high-to-low') {
      return b.price - a.price;
    }
    return 0;
  });

  // Пагинация
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (productListRef.current) {
      productListRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [currentPage, sortOrder]);

  return (
    <div className="product-list-container">
      {filteredProducts.length > 0 && (
        <div className="sort-controls">
          <label htmlFor="sort-select">Сортировать по цене: </label>
          <select id="sort-select" value={sortOrder} onChange={handleSortChange}>
            <option value="none">Без сортировки</option>
            <option value="low-to-high">От дешёвых к дорогим</option>
            <option value="high-to-low">От дорогих к дешёвым</option>
          </select>
        </div>
      )}
      <div className="product-list" ref={productListRef}>
        {currentProducts.length > 0 ? (
          currentProducts.map(product => (
            <ProductCard key={product.id} product={product} view="grid" />
          ))
        ) : (
          <p>Товары отсутствуют.</p>
        )}
      </div>
      {filteredProducts.length > 0 && (
        <div className="pagination">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Предыдущая
          </button>
          <span>Страница {currentPage} из {totalPages}</span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Следующая
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;