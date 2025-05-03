import React from 'react';
import { Link, useParams } from 'react-router-dom';
import './Navigation.css';

const categories = [
  { id: 'all', name: 'Всі категорії' },
  { id: 'category1', name: 'Бокси' },
  { id: 'category2', name: 'Дитячі букети' },
  { id: 'category3', name: 'Чоловічі букети, коробки' },
  { id: 'category4', name: 'Солодкі букети, коробки' },
  { id: 'category5', name: 'Сухофрукти, фрукти' },
  { id: 'category6', name: 'Полуниця в шоколаді' },
  { id: 'category8', name: 'Квіти' },
];

const Navigation = () => {
  const { category = 'all' } = useParams();

  return (
    <nav className="navigation">
      <ul className="navigation-list">
        {categories.map((cat) => (
          <li
            key={cat.id}
            className={`navigation-item ${cat.id === category ? 'active' : ''}`}
          >
            <Link to={`/catalog/${cat.id}`}>{cat.name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;