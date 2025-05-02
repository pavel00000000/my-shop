const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000; // Используем PORT из окружения для Render

const token = '7283158477:AAER8yRK1_L1CZQq2S_dixa4nuIABi-Y1_M';
const chatId = '7949346094';
const bot = new TelegramBot(token, { polling: false });

// Настройка CORS
const allowedOrigins = [
  'http://localhost:3001',
  'http://172.21.64.1:3001',
  'https://my-shop.onrender.com', // Добавьте ваш домен Render
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Обслуживание статических файлов из папки public (для изображений)
app.use('/papka', express.static(path.join(__dirname, 'public/papka')));

// Обслуживание собранного React-приложения из папки build
app.use(express.static(path.join(__dirname, 'build')));

// API для обработки заказов
app.post('/api/order', async (req, res) => {
  const { name, phone, deliveryMethod, city, warehouse, address, pickupAddress, comment, paymentMethod, deliveryCost, prepayment, cartItems } = req.body;

  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    console.error('Ошибка: Корзина пуста');
    return res.status(400).json({ error: 'Корзина пуста' });
  }

  let deliveryInfo = '';
  if (deliveryMethod === 'nova-poshta') {
    deliveryInfo = `Доставка: Новая Почта\nГород: ${city}\nОтделение: ${warehouse}\nСтоимость доставки: ${deliveryCost} грн\nПредоплата (40%): ${prepayment.toFixed(2)} грн`;
  } else if (deliveryMethod === 'courier') {
    deliveryInfo = `Доставка: Курьерская доставка\nАдрес: ${address}`;
  } else if (deliveryMethod === 'self-pickup') {
    deliveryInfo = `Доставка: Самовывоз\nАдрес: ${pickupAddress}`;
  }

  let paymentInfo = '';
  if (deliveryMethod === 'nova-poshta') {
    if (paymentMethod === 'privatbank') {
      paymentInfo = `Способ оплаты: ПриватБанк\nНомер карты: 4149499343979074\nИмя владельца: МНЕКА АННА ВОЛОДИМИРІВНА`;
    } else if (paymentMethod === 'iban') {
      paymentInfo = `Способ оплаты: По IBAN\nОтримувач: МНЕКА АННА ВОЛОДИМИРІВНА\nIBAN: UA093052990000026200670683058\nРНОКПП/ЄДРПОУ: 3154912189\nПризначення платежу: Поповнення рахунку, МНЕКА АННА ВОЛОДИМИРІВНА`;
    }
  }

  let message = 'Новый заказ!\n\n';
  message += `Дата и время: ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Kiev' })}\n`;
  message += `Имя: ${name}\n`;
  message += `Телефон: ${phone}\n`;
  message += `${deliveryInfo}\n`;
  if (paymentInfo) message += `${paymentInfo}\n`;
  message += `Комментарий: ${comment || 'Нет'}\n\n`;
  message += 'Товары:\n';
  cartItems.forEach((item, index) => {
    message += `${index + 1}. ${item.composition} - ${item.price} грн (x${item.quantity})\n`;
  });
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  message += `\nИтого: ${total} грн`;
  if (deliveryMethod === 'nova-poshta') {
    message += `\nИтого с доставкой: ${total + deliveryCost} грн`;
  }

  try {
    await bot.sendMessage(chatId, message);
    console.log('Сообщение отправлено');

    for (const item of cartItems) {
      if (item.image) {
        const relativePath = item.image.startsWith('/') ? item.image.slice(1) : item.image;
        const absolutePath = path.join(__dirname, 'public', relativePath);
        const normalizedPath = path.normalize(absolutePath);
        if (fs.existsSync(normalizedPath)) {
          await bot.sendPhoto(chatId, normalizedPath, {
            caption: `Изображение товара: ${item.composition}`,
          });
          console.log(`Изображение отправлено: ${normalizedPath}`);
        } else {
          console.warn(`Файл не найден: ${normalizedPath}`);
        }
      }
    }

    res.status(200).json({ message: 'Заказ успешно отправлен' });
  } catch (error) {
    console.error('Ошибка отправки:', error.message);
    res.status(500).json({ error: 'Ошибка при отправке заказа' });
  }
});

// Перенаправление всех остальных запросов на index.html для SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});