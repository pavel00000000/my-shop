import React, { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product, view }) => {
  const [showCartModal, setShowCartModal] = useState(false); // Модальное окно для корзины
  const [showCompositionModal, setShowCompositionModal] = useState(false); // Модальное окно для состава
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleBuy = () => {
    addToCart(product);
    setShowCartModal(true);
  };

  const closeCartModal = () => {
    setShowCartModal(false);
  };

  const goToCart = () => {
    setShowCartModal(false);
    navigate('/cart');
  };

  const openCompositionModal = () => {
    setShowCompositionModal(true);
  };

  const closeCompositionModal = () => {
    setShowCompositionModal(false);
  };

  return (
    <div className={`product-card ${view}`}>
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
      <div className="product-actions">
        <button onClick={openCompositionModal} className="product-link details">
          Состав
        </button>
        <button onClick={handleBuy} className="product-link buy">Купить</button>
      </div>

      {/* Модальное окно для корзины */}
      {showCartModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Товар добавлен в корзину</h2>
            <p>Вы можете продолжить покупки или перейти в корзину для оформления заказа.</p>
            <div className="modal-actions">
              <button onClick={closeCartModal} className="continue-shopping">Продолжить покупки</button>
              <button onClick={goToCart} className="go-to-cart">Перейти в корзину</button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно для состава */}
      {showCompositionModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Состав продукта</h2>
            <p>{product.composition || 'Состав не указан'}</p>
            <div className="modal-actions">
              <button onClick={closeCompositionModal} className="close-modal">Закрыть</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;