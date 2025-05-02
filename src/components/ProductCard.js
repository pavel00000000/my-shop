import React, { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product, view }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleBuy = () => {
    addToCart(product);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const goToCart = () => {
    setShowModal(false);
    navigate('/cart');
  };

  return (
    <div className={`product-card ${view} ${isExpanded ? 'expanded' : ''}`}>
      <div className="image-wrapper">
        {product.image ? (
          <img
            src={product.image}
            alt={product.imageAlt}
            className="product-image"
          />
        ) : (
          <div className="image-placeholder">Фотография отсутствует</div>
        )}
      </div>
      <p>{product.price} грн</p>
      {isExpanded && (
        <div className="composition-wrapper">
          <p>{product.composition}</p>
        </div>
      )}
      <div className="product-actions">
        <button onClick={toggleExpand} className="product-link details">
          {isExpanded ? 'Скрыть' : 'Подробнее'}
        </button>
        <button onClick={handleBuy} className="product-link buy">Купить</button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Товар добавлен в корзину</h2>
            <p>Вы можете продолжить покупки или перейти в корзину для оформления заказа.</p>
            <div className="modal-actions">
              <button onClick={closeModal} className="continue-shopping">Продолжить покупки</button>
              <button onClick={goToCart} className="go-to-cart">Перейти в корзину</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;