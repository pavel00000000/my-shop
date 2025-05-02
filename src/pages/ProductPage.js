import React from 'react';
import ProductList from '../components/ProductList';

const ProductPage = ({ match }) => {
  // Если используется react-router, category может приходить из URL
  const category = match?.params?.category || 'all';

  return (
    <div>
      <h1>Каталог товаров</h1>
      <ProductList category={category} productsPerPage={10} />
    </div>
  );
};

export default ProductPage;