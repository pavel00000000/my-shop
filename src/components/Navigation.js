import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navigation.css';

// Список категорий с мета-данными
const categories = [
  {
    path: '/catalog/all',
    name: 'Загальний роздiл',
    title: 'Переглянути всі подарунки та букети в Києві',
  },
  {
    path: '/catalog/category1',
    name: 'Бокси',
    title: 'Подарункові бокси з доставкою в Києві',
  },
  {
    path: '/catalog/category2',
    name: 'Дитячі букети',
    title: 'Дитячі букети для свят у Києві',
  },
  {
    path: '/catalog/category3',
    name: 'Чоловічі букети, коробки',
    title: 'Чоловічі букети та подарункові коробки в Києві',
  },
  {
    path: '/catalog/category4',
    name: 'Солодкі букети, коробки',
    title: 'Солодкі букети та коробки з доставкою в Києві',
  },
  {
    path: '/catalog/category5',
    name: 'Сухофрукти, фрукти',
    title: 'Подарункові набори із сухофруктів та фруктів у Києві',
  },
  {
    path: '/catalog/category6',
    name: 'Полуниця в шоколаді',
    title: 'Полуниця в шоколаді з доставкою в Києві',
  },
  {
    path: '/catalog/category8',
    name: 'Квіти',
    title: 'Свіжі квіти та букети з доставкою в Києві',
  },
];

const Navigation = () => {
  const navigate = useNavigate();

  // Функция для отправки события и навигации
  const handleCategoryClick = (categoryName, path) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'select_content',
      content_type: 'category',
      content_id: categoryName,
    });
    console.log('Navigation.js: Клик по категории:', categoryName, 'Путь:', path);
    navigate(path); // Явная навигация для надёжности
  };

  return (
    <nav className="navigation" data-testid="navigation">
      <ul>
        {categories.map((category) => (
          <li key={category.path}>
            <Link
              to={category.path}
              title={category.title}
              onClick={(e) => {
                e.preventDefault(); // Предотвращаем стандартное поведение Link
                handleCategoryClick(category.name, category.path);
              }}
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;