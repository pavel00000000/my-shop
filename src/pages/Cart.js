import React, { useState, useContext, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import Confetti from 'react-confetti';
import './Cart.css';

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
    <div className="autocomplete">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Введите город"
        className="form-input"
      />
      {cities.length > 0 && (
        <ul className="autocomplete-list">
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
    <div className="autocomplete">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Введите отделение"
        className="form-input"
      />
      {warehouses.length > 0 && (
        <ul className="autocomplete-list">
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
  const [showConfetti, setShowConfetti] = useState(false);

  if (!context) {
    return <p>Ошибка: Контекст корзины не найден.</p>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const copyToClipboard = (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopyMessage('Скопировано!');
        setTimeout(() => setCopyMessage(''), 2000);
      }).catch((err) => {
        console.error('Ошибка копирования:', err);
        setCopyMessage('Ошибка копирования');
      });
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        setCopyMessage('Скопировано!');
        setTimeout(() => setCopyMessage(''), 2000);
      } catch (err) {
        console.error('Ошибка копирования:', err);
        setCopyMessage('Ошибка копирования');
      }
      document.body.removeChild(textarea);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitMessage('');

    if (!cartItems || cartItems.length === 0) {
      setSubmitMessage('Ошибка: Корзина пуста');
      setIsSubmitting(false);
      return;
    }

    if (!formData.paymentMethod) {
      setSubmitMessage('Ошибка: Выберите способ оплаты');
      setIsSubmitting(false);
      return;
    }

    let deliveryData = {};
    if (formData.deliveryMethod === 'nova-poshta') {
      if (!selectedCity || !selectedWarehouse) {
        setSubmitMessage('Ошибка: Выберите город и отделение');
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
        setSubmitMessage('Ошибка: Укажите адрес доставки');
        setIsSubmitting(false);
        return;
      }
      deliveryData = { address: formData.address };
    } else if (formData.deliveryMethod === 'self-pickup') {
      if (!formData.name || !formData.phone) {
        setSubmitMessage('Ошибка: Укажите имя и номер телефона');
        setIsSubmitting(false);
        return;
      }
      deliveryData = { pickupAddress: 'Самовывоз, город Кропивницкий' };
    }

    try {
      const response = await fetch('http://localhost:3000/api/order', {
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
        const successMessage = 'Спасибо за заказ. Ваш заказ принят в обработку.';
        setSubmitMessage(successMessage);
        setShowConfetti(true);
        setTimeout(() => {
          setShowConfetti(false);
          setSubmitMessage('');
        }, 5000);
        clearCart();
        setFormData({ name: '', phone: '', deliveryMethod: 'nova-poshta', address: '', comment: '', paymentMethod: 'privatbank' });
        setSelectedCity(null);
        setSelectedWarehouse(null);
      } else {
        setSubmitMessage(`Ошибка: ${data.error || 'Не удалось отправить заказ'}`);
      }
    } catch (error) {
      console.error('Ошибка при отправке:', error);
      setSubmitMessage('Ошибка при отправке заказа.');
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

  return (
    <div className="cart-wrapper">
      <div className="cart-container">
        {showConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            numberOfPieces={500}
            colors={['#c49bbb', '#f4c2c2', '#ffb6c1', '#dda0dd', '#e6e6fa']}
          />
        )}
        <h1>Корзина</h1>
        {cartItems.length === 0 ? (
          <p>Корзина пуста</p>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.imageAlt} className="cart-item-image" />
                  <div className="cart-item-details">
                    <h3>{item.composition}</h3>
                    <p>Цена: {item.price} грн</p>
                    <div className="quantity-controls">
                      <button
                        className="quantity-button"
                        onClick={() => decreaseQuantity(item.id)}
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button
                        className="quantity-button"
                        onClick={() => increaseQuantity(item.id)}
                      >
                        +
                      </button>
                    </div>
                    <button className="remove-button" onClick={() => removeFromCart(item.id)}>
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-total">
              <h3>Итого: {totalPrice} грн</h3>
              {formData.deliveryMethod === 'nova-poshta' && (
                <>
                  <p>Доставка: {deliveryCost} грн</p>
                  <p>Предоплата (40%): {prepayment.toFixed(2)} грн</p>
                  <p>Итого с доставкой: {totalWithDelivery.toFixed(2)} грн</p>
                </>
              )}
            </div>
            <div className="order-form">
              <h2>Оформить заказ</h2>
              <div className="form-group">
                <label htmlFor="name">Имя:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
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
              <div className="form-group">
                <label>Способ доставки:</label>
                <div className="delivery-options">
                  <div
                    className={`delivery-card ${formData.deliveryMethod === 'nova-poshta' ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, deliveryMethod: 'nova-poshta' })}
                  >
                    <h3>Новая Почта</h3>
                    <p>Доставка от 80 грн, предоплата 40%</p>
                  </div>
                  <div
                    className={`delivery-card ${formData.deliveryMethod === 'courier' ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, deliveryMethod: 'courier' })}
                  >
                    <h3>Курьерская доставка</h3>
                    <p>Доставка по городу Кропивницкий</p>
                  </div>
                  <div
                    className={`delivery-card ${formData.deliveryMethod === 'self-pickup' ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, deliveryMethod: 'self-pickup' })}
                  >
                    <h3>Самовывоз</h3>
                    <p>Самовывоз, город Кропивницкий</p>
                  </div>
                </div>
              </div>
              {formData.deliveryMethod === 'nova-poshta' && (
                <div className="delivery-details">
                  <div className="form-group">
                    <label>Город:</label>
                    <CitySelect onSelect={(city) => setSelectedCity(city)} />
                  </div>
                  {selectedCity && (
                    <div className="form-group">
                      <label>Отделение:</label>
                      <WarehouseSelect
                        cityRef={selectedCity.DeliveryCity}
                        onSelect={(warehouse) => setSelectedWarehouse(warehouse)}
                      />
                    </div>
                  )}
                </div>
              )}
              {formData.deliveryMethod === 'courier' && (
                <div className="delivery-details">
                  <div className="form-group">
                    <label htmlFor="address">Адрес доставки:</label>
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
                <div className="delivery-details">
                  <p>Оставьте ваше имя и номер телефона, и менеджер перезвонит вам в течение 30 минут.</p>
                </div>
              )}
              <div className="form-group">
                <label>Способ оплаты:</label>
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
                    Номер карты: 4149499343979074
                    <span className="copy-icon" onClick={() => copyToClipboard('4149499343979074')}>
                      📋
                    </span>
                  </p>
                  <p>Имя владельца: МНЕКА АННА ВОЛОДИМИРІВНА</p>
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
                    <span className="copy-icon" onClick={() => copyToClipboard('UA093052990000026200670683058')}>
                      📋
                    </span>
                  </p>
                  <p>
                    РНОКПП/ЄДРПОУ: 3154912189
                    <span className="copy-icon" onClick={() => copyToClipboard('3154912189')}>
                      📋
                    </span>
                  </p>
                  <p>Призначення платежу: Поповнення рахунку, МНЕКА АННА ВОЛОДИМИРІВНА</p>
                </div>
                {copyMessage && <p className="copy-message">{copyMessage}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="comment">Комментарий:</label>
                <textarea
                  id="comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                />
              </div>
              <button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Отправка...' : 'Отправить заказ'}
              </button>
              {submitMessage && (
                <div className={`message ${submitMessage.includes('Спасибо') ? 'success-message' : 'error-message'}`}>
                  <p>{submitMessage}</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;