import React, { useState, useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { CartContext } from '../context/CartContext';
import Confetti from 'react-confetti';
import './Cart.css';
import { useParams, Link, useNavigate } from 'react-router-dom';

// Определяем базовый URL для API в зависимости от окружения
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://my-shop-7mpy.onrender.com'
  : 'http://localhost:3000';

const CitySelect = ({ onSelect }) => {
  const [cities, setCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (searchTerm.length >= 2) {
      fetchCities(searchTerm);
    } else {
      setCities([]);
    }
  }, [searchTerm]);

  const fetchCities = async (term) => {
    try {
      const response = await fetch('https://api.novaposhta.ua/v2.0/json/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: 'a524a6f730358f0792acfe9684cf016b',
          modelName: 'Address',
          calledMethod: 'searchSettlements',
          methodProperties: { CityName: term, Limit: '20', Page: '1' },
        }),
      });
      const data = await response.json();
      if (data.success && data.data[0]?.Addresses?.length > 0) {
        setCities(data.data[0].Addresses);
      } else {
        setCities([]);
      }
    } catch (error) {
      console.error('Ошибка при получении городов:', error);
      setCities([]);
    }
  };

  const handleSelect = (city) => {
    onSelect(city);
    setSearchTerm(city.MainDescription);
    setCities([]);
  };

  return (
    <div className="cart-unique-autocomplete">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Введіть місто"
        className="form-input"
      />
      {cities.length > 0 && (
        <ul className="cart-unique-autocomplete-list">
          {cities.map((city) => (
            <li key={city.DeliveryCity} onClick={() => handleSelect(city)}>
              {city.MainDescription}, {city.Area} обл.
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const WarehouseSelect = ({ cityRef, onSelect }) => {
  const [warehouses, setWarehouses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (cityRef && searchTerm.length >= 0) {
      fetchWarehouses(cityRef, searchTerm);
    } else {
      setWarehouses([]);
    }
  }, [cityRef, searchTerm]);

  const fetchWarehouses = async (cityRef, term) => {
    try {
      const response = await fetch('https://api.novaposhta.ua/v2.0/json/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: 'a524a6f730358f0792acfe9684cf016b',
          modelName: 'AddressGeneral',
          calledMethod: 'getWarehouses',
          methodProperties: {
            CityRef: cityRef,
            Limit: '50',
            Page: '1',
            Language: 'UA',
            FindByString: term,
          },
        }),
      });
      const data = await response.json();
      if (data.success && data.data.length > 0) {
        setWarehouses(data.data);
      } else {
        setWarehouses([]);
      }
    } catch (error) {
      console.error('Ошибка при получении отделений:', error);
      setWarehouses([]);
    }
  };

  const handleSelect = (warehouse) => {
    onSelect(warehouse);
    setSearchTerm(warehouse.Description);
    setWarehouses([]);
  };

  return (
    <div className="cart-unique-autocomplete">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Введіть відділення"
        className="form-input"
      />
      {warehouses.length > 0 && (
        <ul className="cart-unique-autocomplete-list">
          {warehouses.map((warehouse) => (
            <li key={warehouse.Ref} onClick={() => handleSelect(warehouse)}>
              {warehouse.Description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Cart = () => {
  const context = useContext(CartContext);
  const { cartItems = [], removeFromCart, clearCart, increaseQuantity, decreaseQuantity } = context || {};
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    deliveryMethod: 'nova-poshta',
    address: '',
    comment: '',
    paymentMethod: 'privatbank',
  });
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [copyMessage, setCopyMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Отслеживание просмотра корзины
  useEffect(() => {
    if (cartItems.length > 0) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'view_cart',
        ecommerce: {
          currency: 'UAH',
          value: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
          items: cartItems.map((item) => ({
            item_id: item.id,
            item_name: item.composition,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      });
    }
  }, [cartItems]);

  if (!context) {
    return <p>Помилка: Контекст кошика не знайдено.</p>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const copyToClipboard = (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopyMessage('Скопійовано!');
          setTimeout(() => setCopyMessage(''), 2000);
        })
        .catch((err) => {
          console.error('Помилка копіювання:', err);
          setCopyMessage('Помилка копіювання');
        });
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        setCopyMessage('Скопійовано!');
        setTimeout(() => setCopyMessage(''), 2000);
      } catch (err) {
        console.error('Помилка копіювання:', err);
        setCopyMessage('Помилка копіювання');
      }
      document.body.removeChild(textarea);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitMessage('');

    // Событие начала оформления заказа
    if (cartItems.length > 0) {
      window.dataLayer.push({
        event: 'begin_checkout',
        ecommerce: {
          currency: 'UAH',
          value: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
          items: cartItems.map((item) => ({
            item_id: item.id,
            item_name: item.composition,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      });
    }

    if (!cartItems || cartItems.length === 0) {
      setSubmitMessage('Помилка: Кошик порожній');
      setIsSubmitting(false);
      return;
    }

    if (!formData.paymentMethod) {
      setSubmitMessage('Помилка: Виберіть спосіб оплати');
      setIsSubmitting(false);
      return;
    }

    let deliveryData = {};
    if (formData.deliveryMethod === 'nova-poshta') {
      if (!selectedCity || !selectedWarehouse) {
        setSubmitMessage('Помилка: Виберіть місто та відділення');
        setIsSubmitting(false);
        return;
      }
      deliveryData = {
        city: selectedCity.MainDescription,
        warehouse: selectedWarehouse.Description,
        deliveryCost: 80,
        prepayment: totalPrice * 0.4,
      };
    } else if (formData.deliveryMethod === 'courier') {
      if (!formData.address) {
        setSubmitMessage('Помилка: Вкажіть адресу доставки');
        setIsSubmitting(false);
        return;
      }
      deliveryData = { address: formData.address };
    } else if (formData.deliveryMethod === 'self-pickup') {
      if (!formData.name || !formData.phone) {
        setSubmitMessage('Помилка: Вкажіть ім’я та номер телефону');
        setIsSubmitting(false);
        return;
      }
      deliveryData = { pickupAddress: 'Самовивіз, місто Кропивницький' };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          deliveryMethod: formData.deliveryMethod,
          ...deliveryData,
          comment: formData.comment,
          paymentMethod: formData.paymentMethod,
          cartItems,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setShowModal(true);

        // Событие покупки
        window.dataLayer.push({
          event: 'purchase',
          ecommerce: {
            transaction_id: data.orderId || `TX${Date.now()}`,
            value: totalPrice + (formData.deliveryMethod === 'nova-poshta' ? 80 : 0),
            currency: 'UAH',
            items: cartItems.map((item) => ({
              item_id: item.id,
              item_name: item.composition,
              price: item.price,
              quantity: item.quantity,
            })),
          },
        });

        clearCart();
        setFormData({
          name: '',
          phone: '',
          deliveryMethod: 'nova-poshta',
          address: '',
          comment: '',
          paymentMethod: 'privatbank',
        });
        setSelectedCity(null);
        setSelectedWarehouse(null);
      } else {
        setSubmitMessage(`Помилка: ${data.error || 'Не вдалося відправити замовлення'}`);
      }
    } catch (error) {
      console.error('Помилка при відправці замовлення:', error.message);
      setSubmitMessage('Помилка при відправці замовлення. Спробуйте пізніше.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice = Array.isArray(cartItems)
    ? cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : 0;

  const deliveryCost = formData.deliveryMethod === 'nova-poshta' ? 80 : 0;
  const prepayment = formData.deliveryMethod === 'nova-poshta' ? totalPrice * 0.4 : 0;
  const totalWithDelivery = totalPrice + deliveryCost;

  // Структурированные данные для корзины
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Order',
    orderStatus: 'http://schema.org/OrderProcessing',
    merchant: {
      '@type': 'Organization',
      name: 'My Shop',
    },
    potentialAction: {
      '@type': 'OrderAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://my-shop-7mpy.onrender.com/cart',
        inLanguage: 'uk',
      },
      name: 'Оформити замовлення',
    },
    priceSpecification: {
      '@type': 'PriceSpecification',
      price: totalWithDelivery,
      priceCurrency: 'UAH',
    },
  };

  return (
    <div className="cart-unique-wrapper">
      <Helmet>
        <title>Кошик | Оформити Замовлення в Києві | My Shop</title>
        <meta
          name="description"
          content="Оформіть замовлення солодких букетів, подарункових боксів та квітів у Києві. Швидка доставка!"
        />
        <meta
          name="keywords"
          content="оформити замовлення київ, заказать подарки киев, кошик подарунків, корзина киев"
        />
        <meta name="robots" content="noindex, follow" />
        <meta name="language" content="uk" />
        <link rel="canonical" href="https://my-shop-7mpy.onrender.com/cart" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <div className="cart-unique-container">
        <h1>Кошик</h1>
        {cartItems.length === 0 ? (
          <p>Кошик порожній</p>
        ) : (
          <>
            <div className="cart-unique-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-unique-item">
                  <img
                    src={item.image}
                    alt={item.imageAlt || `Солодкий букет ${item.composition}`}
                    className="cart-unique-item-image"
                    loading="lazy"
                  />
                  <div className="cart-unique-item-details">
                    <h3>{item.composition}</h3>
                    <p>Ціна: {item.price} грн</p>
                    <div className="cart-unique-quantity-controls">
                      <button
                        className="cart-unique-quantity-button"
                        onClick={() => decreaseQuantity(item.id)}
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span className="cart-unique-quantity">{item.quantity}</span>
                      <button
                        className="cart-unique-quantity-button"
                        onClick={() => increaseQuantity(item.id)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="cart-unique-remove-button"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Видалити
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-unique-total">
              <h3>Разом: {totalPrice} грн</h3>
              {formData.deliveryMethod === 'nova-poshta' && (
                <>
                  <p>Доставка: {deliveryCost} грн</p>
                  <p>Передплата (40%): {prepayment.toFixed(2)} грн</p>
                  <p>Разом з доставкою: {totalWithDelivery.toFixed(2)} грн</p>
                </>
              )}
            </div>
            <div className="cart-unique-order-form">
              <h2>Оформити замовлення</h2>
              <div className="cart-unique-form-group">
                <label htmlFor="name">Ім’я:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="cart-unique-form-group">
                <label htmlFor="phone">Телефон:</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="cart-unique-form-group">
                <label>Спосіб доставки:</label>
                <div className="cart-unique-delivery-options">
                  <div
                    className={`cart-unique-delivery-card ${formData.deliveryMethod === 'nova-poshta' ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, deliveryMethod: 'nova-poshta' })}
                  >
                    <h3>Нова Пошта</h3>
                    <p>Доставка від 80 грн, передплата 40%</p>
                  </div>
                  <div
                    className={`cart-unique-delivery-card ${formData.deliveryMethod === 'courier' ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, deliveryMethod: 'courier' })}
                  >
                    <h3>Кур’єрська доставка</h3>
                    <p>Доставка по місту Кропивницький</p>
                  </div>
                  <div
                    className={`cart-unique-delivery-card ${formData.deliveryMethod === 'self-pickup' ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, deliveryMethod: 'self-pickup' })}
                  >
                    <h3>Самовивіз</h3>
                    <p>Самовивіз, місто Кропивницький</p>
                  </div>
                </div>
              </div>
              {formData.deliveryMethod === 'nova-poshta' && (
                <div className="cart-unique-delivery-details">
                  <div className="cart-unique-form-group">
                    <label>Місто:</label>
                    <CitySelect onSelect={(city) => setSelectedCity(city)} />
                  </div>
                  {selectedCity && (
                    <div className="cart-unique-form-group">
                      <label>Відділення:</label>
                      <WarehouseSelect
                        cityRef={selectedCity.DeliveryCity}
                        onSelect={(warehouse) => setSelectedWarehouse(warehouse)}
                      />
                    </div>
                  )}
                </div>
              )}
              {formData.deliveryMethod === 'courier' && (
                <div className="cart-unique-delivery-details">
                  <div className="cart-unique-form-group">
                    <label htmlFor="address">Адреса доставки:</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              )}
              {formData.deliveryMethod === 'self-pickup' && (
                <div className="cart-unique-delivery-details">
                  <p>Залиште ваше ім’я та номер телефону, і менеджер передзвонить вам протягом 30 хвилин.</p>
                </div>
              )}
              <div className="cart-unique-form-group">
                <label>Спосіб оплати:</label>
                <div>
                  <input
                    type="radio"
                    id="privatbank"
                    name="paymentMethod"
                    value="privatbank"
                    checked={formData.paymentMethod === 'privatbank'}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="privatbank">ПриватБанк</label>
                  <p>
                    Номер картки: 4149499343979074
                    <span
                      className="cart-unique-copy-icon"
                      onClick={() => copyToClipboard('4149499343979074')}
                    >
                      📋
                    </span>
                  </p>
                  <p>Ім’я власника: МНЕКА АННА ВОЛОДИМИРІВНА</p>
                </div>
                <div>
                  <input
                    type="radio"
                    id="iban"
                    name="paymentMethod"
                    value="iban"
                    checked={formData.paymentMethod === 'iban'}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="iban">По IBAN</label>
                  <p>Отримувач: МНЕКА АННА ВОЛОДИМИРІВНА</p>
                  <p>
                    IBAN: UA093052990000026200670683058
                    <span
                      className="cart-unique-copy-icon"
                      onClick={() => copyToClipboard('UA093052990000026200670683058')}
                    >
                      📋
                    </span>
                  </p>
                  <p>
                    РНОКПП/ЄДРПОУ: 3154912189
                    <span
                      className="cart-unique-copy-icon"
                      onClick={() => copyToClipboard('3154912189')}
                    >
                      📋
                    </span>
                  </p>
                  <p>Призначення платежу: Поповнення рахунку, МНЕКА АННА ВОЛОДИМИРІВНА</p>
                </div>
                {copyMessage && <p className="cart-unique-copy-message">{copyMessage}</p>}
              </div>
              <div className="cart-unique-form-group">
                <label htmlFor="comment">Коментар:</label>
                <textarea
                  id="comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                />
              </div>
              <button className="cart-unique-submit-button" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Відправка...' : 'Відправити замовлення'}
              </button>
              {submitMessage && (
                <div
                  className={`cart-unique-message ${submitMessage.includes('Дякуємо') ? 'cart-unique-success-message' : 'cart-unique-error-message'}`}
                >
                  <p>{submitMessage}</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      {showModal && (
        <div className="cart-unique-modal">
          <div className="cart-unique-modal-content">
            <h2>Дякуємо за замовлення!</h2>
            <p>Ваше замовлення успішно прийнято в обробку.</p>
            <div className="cart-unique-modal-buttons">
              <button
                className="cart-unique-modal-button"
                onClick={() => navigate('/')}
              >
                Главная страница
              </button>
              <button
                className="cart-unique-modal-button"
                onClick={() => navigate('/categories')}
              >
                Категории
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;