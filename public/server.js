const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');
const path = require('path');

const app = express();
const port = 3000;

// Telegram Bot настройки
const token = '7283158477:AAER8yRK1_L1CZQq2S_dixa4nuIABi-Y1_M'; // Ваш токен
const chatId = '7949346094'; // Ваш chat ID

const bot = new TelegramBot(token, { polling: false });

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Маршрут для обработки заказов
app.post('/api/order', (req, res) => {
  const { name, phone, address, comment, cartItems } = req.body;

  // Проверка входных данных
  if (!name || !phone || !address || !cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({ error: 'Некорректные данные заказа' });
  }

  let message = `Новый заказ!\n\n`;
  message += `Имя: ${name}\n`;
  message += `Телефон: ${phone}\n`;
  message += `Адрес: ${address}\n`;
  message += `Комментарий: ${comment || 'Нет'}\n\n`;
  message += `Товары:\n`;
  cartItems.forEach((item, index) => {
    message += `${index + 1}. ${item.composition} - ${item.price} грн (x${item.quantity})\n`;
  });
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  message += `\nИтого: ${total} грн`;

  bot.sendMessage(chatId, message)
    .then(() => {
      res.status(200).json({ message: 'Заказ успешно отправлен' });
    })
    .catch((error) => {
      console.error('Ошибка отправки в Telegram:', error.message);
      res.status(500).json({ error: 'Ошибка при отправке заказа' });
    });
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});