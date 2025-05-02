import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  return (
    <nav className="navigation" data-testid="navigation">
      <ul>
        <li><Link to="/catalog/all">Загальний роздiл</Link></li>
        <li><Link to="/catalog/category1">Бокси</Link></li>
        <li><Link to="/catalog/category2">Дитячі букети</Link></li>
        <li><Link to="/catalog/category3">Чоловічі букети, коробки</Link></li>
        <li><Link to="/catalog/category4">Солодкі букети, коробки</Link></li>
        <li><Link to="/catalog/category5">Сухофрукти, фрукти</Link></li>
        <li><Link to="/catalog/category6">Полуниця в шоколаді</Link></li>
        <li><Link to="/catalog/category8">Квіти</Link></li>
      </ul>
    </nav>
  );
};

export default Navigation;