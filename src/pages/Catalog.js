import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navigation from '../components/Navigation';
import ProductList from '../components/ProductList';
import './Catalog.css';

// Мета-данные для категорий
const categoryMeta = {
  all: {
    name: 'Загальний роздiл',
    ukr: 'купити подарунки київ',
    rus: 'купить подарки киев',
    description: 'Ознайомтеся з каталогом солодких букетів, подарункових боксів, квітів та полуниці в шоколаді у Києві.',
  },
  category1: {
    name: 'Бокси',
    ukr: 'подарункові бокси київ',
    rus: 'подарочные боксы киев',
    description: 'Замовляйте подарункові бокси у Києві. Унікальний дизайн, швидка доставка!',
  },
  category2: {
    name: 'Дитячі букети',
    ukr: 'дитячі букети київ',
    rus: 'детские букеты киев',
    description: 'Яскраві та смачні дитячі букети для свят у Києві. Ідеальні подарунки для дітей!',
  },
  category3: {
    name: 'Чоловічі букети, коробки',
    ukr: 'чоловічі букети київ',
    rus: 'мужские букеты киев',
    description: 'Стильні чоловічі букети та подарункові коробки у Києві. Швидка доставка!',
  },
  category4: {
    name: 'Солодкі букети, коробки',
    ukr: 'солодкі букети київ',
    rus: 'сладкие букеты киев',
    description: 'Замовляйте солодкі букети та коробки у Києві. Смачні подарунки для будь-якого свята!',
  },
  category5: {
    name: 'Сухофрукти, фрукти',
    ukr: 'сухофрукти подарункові київ',
    rus: 'сухофрукты подарочные киев',
    description: 'Подарункові набори із сухофруктів та фруктів у Києві. Здорові та смачні подарунки!',
  },
  category6: {
    name: 'Полуниця в шоколаді',
    ukr: 'полуниця в шоколаді київ',
    rus: 'клубника в шоколаде киев',
    description: 'Замовляйте полуницю в шоколаді у Києві. Ідеальний подарунок для романтичных моментів!',
  },
  category8: {
    name: 'Квіти',
    ukr: 'квіти київ замовити',
    rus: 'цветы киев заказать',
    description: 'Замовляйте свіжі квіти з доставкою у Києві. Букети для будь-якої нагоди!',
  },
};

const Catalog = () => {
  const { category = 'all' } = useParams();

  // Логируем для отладки
  console.log('Catalog.js: Текущая категория:', category);
  console.log('Catalog.js: Рендерится');

  // Настройки productsPerPage для каждой категории
  const categorySettings = {
    all: { productsPerPage: 4 },
    category1: { productsPerPage: 4 },
    category2: { productsPerPage: 4 },
    category3: { productsPerPage: 4 },
    category4: { productsPerPage: 4 },
    category5: { productsPerPage: 4 },
    category6: { productsPerPage: 4 },
    category8: { productsPerPage: 4 },
  };

  const currentCategory = categorySettings[category] || categorySettings.all;
  const meta = categoryMeta[category] || categoryMeta.all;

  // Структурированные данные (Schema.org)
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: meta.name,
    description: meta.description,
    url: `https://my-shop-7mpy.onrender.com/catalog/${category}`,
  };

  return (
    <div className="catalog-container">
      <Helmet>
        <title>{`${meta.name} | Купити в Києві | My Shop`}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={`${meta.ukr}, ${meta.rus}, подарунки київ, замовити в києві`} />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="uk" />
        <link rel="canonical" href={`https://my-shop-7mpy.onrender.com/catalog/${category}`} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <div className="navigation-container">
        <Navigation />
      </div>
      <div className="product-list-container">
        <h1 className="category-title">{meta.name}</h1>
        <p className="category-description">{meta.description}</p>
        <ProductList
          key={category} // Принудительный перерендер при смене категории
          category={category}
          productsPerPage={currentCategory.productsPerPage}
        />
        <div className="cta-section">
          <Link to="/catalog" className="cta-button">
            Переглянути всі категорії
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Catalog;